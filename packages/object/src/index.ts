import * as crypto from "node:crypto";
import { Logger, type LoggerOptions } from "@ts-drp/logger";
import { cloneDeep } from "es-toolkit";
import { deepEqual } from "fast-equals";
import { type FinalityConfig, FinalityStore } from "./finality/index.js";
import {
	type Hash,
	HashGraph,
	type Operation,
	type ResolveConflictsType,
	type SemanticsType,
	type Vertex,
} from "./hashgraph/index.js";
import * as ObjectPb from "./proto/drp/object/v1/object_pb.js";
import { ObjectSet } from "./utils/objectSet.js";

export * as ObjectPb from "./proto/drp/object/v1/object_pb.js";
export * from "./hashgraph/index.js";

export interface DRPPublicCredential {
	ed25519PublicKey: string;
	blsPublicKey: string;
}

export interface IACL {
	grant: (
		senderId: string,
		peerId: string,
		publicKey: DRPPublicCredential,
	) => void;
	revoke: (senderId: string, peerId: string) => void;
	query_getWriters: () => Map<string, DRPPublicCredential>;
	query_isWriter: (peerId: string) => boolean;
	query_isAdmin: (peerId: string) => boolean;
	query_getPeerKey: (peerId: string) => DRPPublicCredential | undefined;
}

export interface DRP {
	semanticsType: SemanticsType;
	resolveConflicts: (vertices: Vertex[]) => ResolveConflictsType;
	// biome-ignore lint: attributes can be anything
	[key: string]: any;
}

type DRPState = {
	// biome-ignore lint: attributes can be anything
	state: Map<string, any>;
};

export type DRPObjectCallback = (
	object: DRPObject,
	origin: string,
	vertices: ObjectPb.Vertex[],
) => void;

export interface IDRPObject extends ObjectPb.DRPObjectBase {
	drp: ProxyHandler<DRP> | null;
	hashGraph: HashGraph;
	subscriptions: DRPObjectCallback[];
}

// snake_casing to match the JSON config
export interface DRPObjectConfig {
	log_config?: LoggerOptions;
	finality_config?: FinalityConfig;
}

export interface LcaAndOperations {
	lca: string;
	linearizedOperations: Operation[];
}

export let log: Logger;

export enum DrpType {
	Acl = "ACL",
	Drp = "DRP",
}

export class DRPObject implements IDRPObject {
	peerId: string;
	id: string;
	abi: string;
	bytecode: Uint8Array;
	vertices: ObjectPb.Vertex[];
	drp: ProxyHandler<DRP> | null;
	acl: ProxyHandler<IACL & DRP> | null;
	hashGraph: HashGraph;
	// mapping from vertex hash to the DRP state
	drpStates: Map<string, DRPState>;
	aclStates: Map<string, DRPState>;
	finalityStore: FinalityStore;
	originalDRP: DRP;
	originalACL: IACL & DRP;
	subscriptions: DRPObjectCallback[];

	constructor(
		peerId: string,
		drp: DRP,
		acl: IACL & DRP,
		id?: string,
		abi?: string,
		config?: DRPObjectConfig,
	) {
		this.peerId = peerId;
		log = new Logger("drp::object", config?.log_config);
		this.id =
			id ??
			crypto
				.createHash("sha256")
				.update(abi ?? "")
				.update(peerId)
				.update(Math.floor(Math.random() * Number.MAX_VALUE).toString())
				.digest("hex");
		this.abi = abi ?? "";
		this.bytecode = new Uint8Array();
		this.vertices = [];
		this.drp = drp ? new Proxy(drp, this.proxyDRPHandler(DrpType.Drp)) : null;
		this.acl = acl ? new Proxy(acl, this.proxyDRPHandler(DrpType.Acl)) : null;
		this.hashGraph = new HashGraph(
			peerId,
			drp?.resolveConflicts?.bind(drp ?? this),
			acl?.resolveConflicts?.bind(acl ?? this),
			drp?.semanticsType,
		);
		this.subscriptions = [];
		this.drpStates = new Map([[HashGraph.rootHash, { state: new Map() }]]);
		this.aclStates = new Map([[HashGraph.rootHash, { state: new Map() }]]);
		this.finalityStore = new FinalityStore(config?.finality_config);
		this.originalDRP = cloneDeep(drp);
		this.originalACL = cloneDeep(acl);
		this.vertices = this.hashGraph.getAllVertices();
	}

	resolveConflicts(vertices: Vertex[]): ResolveConflictsType {
		if (
			this.acl &&
			vertices.some((v) => v.operation?.drpType === DrpType.Acl)
		) {
			const acl = this.acl as IACL & DRP;
			return acl.resolveConflicts(vertices);
		}
		const drp = this.drp as DRP;
		return drp.resolveConflicts(vertices);
	}

	// This function is black magic, it allows us to intercept calls to the DRP object
	proxyDRPHandler(vertexType: DrpType): ProxyHandler<object> {
		const obj = this;
		return {
			get(target, propKey, receiver) {
				const value = Reflect.get(target, propKey, receiver);

				if (typeof value === "function") {
					const fullPropKey = String(propKey);
					return new Proxy(target[propKey as keyof object], {
						apply(applyTarget, thisArg, args) {
							if ((propKey as string).startsWith("query_")) {
								return Reflect.apply(applyTarget, thisArg, args);
							}
							const callerName = new Error().stack
								?.split("\n")[2]
								?.trim()
								.split(" ")[1];
							if (callerName?.startsWith("DRPObject.resolveConflicts")) {
								return Reflect.apply(applyTarget, thisArg, args);
							}
							if (!callerName?.startsWith("Proxy."))
								obj.callFn(fullPropKey, args, vertexType);
							return Reflect.apply(applyTarget, thisArg, args);
						},
					});
				}

				return value;
			},
		};
	}

	private callFn(
		fn: string,
		// biome-ignore lint: value can't be unknown because of protobuf
		args: any,
		drpType: DrpType,
	) {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		let preOperationDRP: any;
		if (drpType === DrpType.Acl) {
			preOperationDRP = this._computeACL(this.hashGraph.getFrontier());
		} else {
			preOperationDRP = this._computeDRP(this.hashGraph.getFrontier());
		}
		const drp = cloneDeep(preOperationDRP);
		try {
			this._applyOperation(drp, { opType: fn, value: args, drpType });
		} catch (e) {
			log.error(
				`Object ${this.id} failed to apply operation: ${e} in callFn ${fn}`,
			);
			return;
		}

		let stateChanged = false;
		for (const key of Object.keys(preOperationDRP)) {
			if (!deepEqual(preOperationDRP[key], drp[key])) {
				stateChanged = true;
				break;
			}
		}

		if (!stateChanged) {
			return;
		}

		const vertex = this.hashGraph.addToFrontier({
			drpType: drpType,
			opType: fn,
			value: args,
		});

		this._setState(vertex, this._getDRPState(drp));
		this._initializeFinalityState(vertex.hash);

		const serializedVertex = ObjectPb.Vertex.create({
			hash: vertex.hash,
			peerId: vertex.peerId,
			operation: vertex.operation,
			dependencies: vertex.dependencies,
			timestamp: vertex.timestamp,
		});
		this.vertices.push(serializedVertex);
		this._notify("callFn", [serializedVertex]);
	}

	/* Merges the vertices into the hashgraph
	 * Returns a tuple with a boolean indicating if there were
	 * missing vertices and an array with the missing vertices
	 */
	merge(vertices: Vertex[]): [merged: boolean, missing: string[]] {
		const missing = [];
		for (const vertex of vertices) {
			// Check to avoid manually crafted `undefined` operations
			if (!vertex.operation || this.hashGraph.vertices.has(vertex.hash)) {
				continue;
			}

			try {
				if (!this._checkWriterPermission(vertex.peerId)) {
					throw new Error(`${vertex.peerId} does not have write permission.`);
				}
				const preComputeLca = this.computeLCA(vertex.dependencies);

				if (vertex.operation.drpType === DrpType.Drp) {
					const drp = this._computeDRP(vertex.dependencies, preComputeLca);
					this.hashGraph.addVertex(
						vertex.operation,
						vertex.dependencies,
						vertex.peerId,
						vertex.timestamp,
						vertex.signature,
					);
					try {
						this._applyOperation(drp, vertex.operation);
					} catch (e) {
						log.error(
							`Object ${this.id} failed to apply operation: ${e} in merge`,
						);
						missing.push(vertex.hash);
						continue;
					}

					this._setACLState(vertex, preComputeLca);
					this._setDRPState(vertex, preComputeLca, this._getDRPState(drp));
				} else {
					const acl = this._computeACL(vertex.dependencies, preComputeLca);

					this.hashGraph.addVertex(
						vertex.operation,
						vertex.dependencies,
						vertex.peerId,
						vertex.timestamp,
						vertex.signature,
					);
					try {
						this._applyOperation(acl, vertex.operation);
					} catch (e) {
						log.error(
							`Object ${this.id} failed to apply operation: ${e} in merge`,
						);
						missing.push(vertex.hash);
						continue;
					}

					this._setACLState(vertex, preComputeLca, this._getDRPState(acl));
					this._setDRPState(vertex, preComputeLca);
				}
				this._initializeFinalityState(vertex.hash);
			} catch (_) {
				missing.push(vertex.hash);
			}
		}

		this.vertices = this.hashGraph.getAllVertices();
		this._updateACLState();
		this._updateDRPState();
		this._notify("merge", this.vertices);

		return [missing.length === 0, missing];
	}

	subscribe(callback: DRPObjectCallback) {
		this.subscriptions.push(callback);
	}

	private _notify(origin: string, vertices: ObjectPb.Vertex[]) {
		for (const callback of this.subscriptions) {
			callback(this, origin, vertices);
		}
	}

	// initialize the attestation store for the given vertex hash
	private _initializeFinalityState(hash: Hash) {
		const fetchedState = this.aclStates.get(hash);
		if (fetchedState !== undefined) {
			const state = cloneDeep(fetchedState);
			const acl = cloneDeep(this.originalACL);

			for (const [key, value] of state.state) {
				acl[key] = value;
			}
			// signer set equals writer set
			this.finalityStore.initializeState(hash, acl.query_getWriters());
		}
	}

	// check if the given peer has write permission
	private _checkWriterPermission(peerId: string): boolean {
		return this.acl ? (this.acl as IACL).query_isWriter(peerId) : true;
	}

	// apply the operation to the DRP
	private _applyOperation(drp: DRP, operation: Operation) {
		const { opType, value } = operation;

		const typeParts = opType.split(".");
		// biome-ignore lint: target can be anything
		let target: any = drp;
		for (let i = 0; i < typeParts.length - 1; i++) {
			target = target[typeParts[i]];
			if (!target) {
				throw new Error(`Invalid operation type: ${opType}`);
			}
		}

		const methodName = typeParts[typeParts.length - 1];
		if (typeof target[methodName] !== "function") {
			throw new Error(`${opType} is not a function`);
		}

		try {
			target[methodName](...value);
		} catch (e) {
			throw new Error(`Error while applying operation ${opType}: ${e}`);
		}
	}

	// compute the DRP based on all dependencies of the current vertex using partial linearization
	private _computeDRP(
		vertexDependencies: Hash[],
		preCompute?: LcaAndOperations,
		vertexOperation?: Operation,
	): DRP {
		const { lca, linearizedOperations } =
			preCompute ?? this.computeLCA(vertexDependencies);

		const drp = cloneDeep(this.originalDRP);

		const fetchedState = this.drpStates.get(lca);
		if (!fetchedState) {
			throw new Error("State is undefined");
		}

		const state = cloneDeep(fetchedState);

		for (const [key, value] of state.state) {
			drp[key] = value;
		}

		for (const op of linearizedOperations) {
			op.drpType === DrpType.Drp && this._applyOperation(drp, op);
		}
		if (vertexOperation) {
			vertexOperation.drpType === DrpType.Drp &&
				this._applyOperation(drp, vertexOperation);
		}

		return drp;
	}

	private _computeACL(
		vertexDependencies: Hash[],
		preCompute?: LcaAndOperations,
		vertexOperation?: Operation,
	): DRP {
		const { lca, linearizedOperations } =
			preCompute ?? this.computeLCA(vertexDependencies);

		const acl = cloneDeep(this.originalACL);

		const fetchedState = this.aclStates.get(lca);
		if (!fetchedState) {
			throw new Error("State is undefined");
		}

		const state = cloneDeep(fetchedState);

		for (const [key, value] of state.state) {
			acl[key] = value;
		}
		for (const op of linearizedOperations) {
			op.drpType === DrpType.Acl && this._applyOperation(acl, op);
		}
		if (vertexOperation) {
			vertexOperation.drpType === DrpType.Acl &&
				this._applyOperation(acl, vertexOperation);
		}

		return acl;
	}

	private computeLCA(vertexDependencies: string[]) {
		const subgraph: ObjectSet<Hash> = new ObjectSet();
		const lca =
			vertexDependencies.length === 1
				? vertexDependencies[0]
				: this.hashGraph.lowestCommonAncestorMultipleVertices(
						vertexDependencies,
						subgraph,
					);
		const linearizedOperations =
			vertexDependencies.length === 1
				? []
				: this.hashGraph.linearizeOperations(lca, subgraph);
		return { lca, linearizedOperations };
	}

	// get the map representing the state of the given DRP by mapping variable names to their corresponding values
	private _getDRPState(drp: DRP): DRPState {
		const varNames: string[] = Object.keys(drp);
		const drpState: DRPState = {
			state: new Map(),
		};
		for (const varName of varNames) {
			drpState.state.set(varName, drp[varName]);
		}
		return drpState;
	}

	private _computeDRPState(
		vertexDependencies: Hash[],
		preCompute?: LcaAndOperations,
		vertexOperation?: Operation,
	): DRPState {
		const drp = this._computeDRP(
			vertexDependencies,
			preCompute,
			vertexOperation,
		);
		return this._getDRPState(drp);
	}

	private _computeACLState(
		vertexDependencies: Hash[],
		preCompute?: LcaAndOperations,
		vertexOperation?: Operation,
	): DRPState {
		const acl = this._computeACL(
			vertexDependencies,
			preCompute,
			vertexOperation,
		);
		return this._getDRPState(acl);
	}

	// store the state of the DRP corresponding to the given vertex
	private _setState(vertex: Vertex, drpState?: DRPState) {
		const preCompute = this.computeLCA(vertex.dependencies);
		this._setACLState(vertex, preCompute, drpState);
		this._setDRPState(vertex, preCompute, drpState);
	}

	private _setACLState(
		vertex: Vertex,
		preCompute?: LcaAndOperations,
		drpState?: DRPState,
	) {
		if (this.acl) {
			this.aclStates.set(
				vertex.hash,
				drpState ??
					this._computeACLState(
						vertex.dependencies,
						preCompute,
						vertex.operation,
					),
			);
		}
	}

	private _setDRPState(
		vertex: Vertex,
		preCompute?: LcaAndOperations,
		drpState?: DRPState,
	) {
		this.drpStates.set(
			vertex.hash,
			drpState ??
				this._computeDRPState(
					vertex.dependencies,
					preCompute,
					vertex.operation,
				),
		);
	}

	// update the DRP's attributes based on all the vertices in the hashgraph
	private _updateDRPState() {
		if (!this.drp) {
			return;
		}
		const currentDRP = this.drp as DRP;
		const newState = this._computeDRPState(this.hashGraph.getFrontier());
		for (const [key, value] of newState.state.entries()) {
			if (key in currentDRP && typeof currentDRP[key] !== "function") {
				currentDRP[key] = value;
			}
		}
	}

	private _updateACLState() {
		if (!this.acl) {
			return;
		}
		const currentACL = this.acl as IACL & DRP;
		const newState = this._computeACLState(this.hashGraph.getFrontier());
		for (const [key, value] of newState.state.entries()) {
			if (key in currentACL && typeof currentACL[key] !== "function") {
				currentACL[key] = value;
			}
		}
	}
}
