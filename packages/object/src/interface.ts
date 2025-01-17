import type {
	Operation,
	ResolveConflictsType,
	SemanticsType,
	Vertex,
} from "./hashgraph/index.js";
import type { DRPObject } from "./index.js";
import type * as ObjectPb from "./proto/drp/object/v1/object_pb.js";

export type DRPState = {
	// biome-ignore lint: preferable to use any instead of unknown
	state: Map<string, any>;
};

export enum DrpType {
	ACL = "ACL",
	DRP = "DRP",
}

export type DRPObjectCallback = (
	object: DRPObject,
	origin: string,
	vertices: ObjectPb.Vertex[],
) => void;

export interface DRPPublicCredential {
	ed25519PublicKey: string;
	blsPublicKey: string;
}

export interface DRP {
	semanticsType: SemanticsType;
	resolveConflicts: (vertices: Vertex[]) => ResolveConflictsType;
	// biome-ignore lint: attributes can be anything
	[key: string]: any;
}

export interface LcaAndOperations {
	lca: string;
	linearizedOperations: Operation[];
}
