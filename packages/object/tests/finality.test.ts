import bls from "@chainsafe/bls/herumi";
import { AddWinsSet } from "@topology-foundation/blueprints/src/index.js";
import { DRPCredentialStore } from "@topology-foundation/node/src/store/index.js";
import { toString as uint8ArrayToString } from "uint8arrays";
import { beforeEach, describe, expect, test } from "vitest";
import type { AggregatedAttestation } from "../dist/src/proto/drp/object/v1/object_pb.js";
import { FinalityState, FinalityStore } from "../src/finality/index.js";
import { BitSet } from "../src/hashgraph/bitset.js";
import { DRPObject } from "../src/index.js";

// initialize log
const _ = new DRPObject("peer1", new AddWinsSet());

describe("Tests for FinalityState", () => {
	const N = 128;
	let finalityState: FinalityState;
	const peers: string[] = [];
	const stores: DRPCredentialStore[] = [];

	beforeEach(async () => {
		for (let i = 0; i < N; i++) {
			peers.push(
				uint8ArrayToString(crypto.getRandomValues(new Uint8Array(32)), "hex"),
			);
		}
		peers.sort();

		for (let i = 0; i < N; i++) {
			stores.push(new DRPCredentialStore());
			await stores[i].start();
		}

		const voters = new Map();
		for (let i = 0; i < N; i++) {
			voters.set(peers[i], stores[i].getPublicCredential());
		}
		finalityState = new FinalityState("vertex1", voters);
	});

	test("addVote: Nodes outside the voter set are rejected", async () => {
		const credentialStore = new DRPCredentialStore();
		await credentialStore.start();

		const signature = credentialStore.signWithBls(finalityState.data);

		expect(() => finalityState.addVote("badNode", signature)).toThrowError(
			"Peer not found in voter list",
		);
	});

	test("addVote: Bad signatures are rejected", async () => {
		const credentialStore = new DRPCredentialStore();
		await credentialStore.start();

		const signature = credentialStore.signWithBls(finalityState.data);

		expect(() => finalityState.addVote(peers[0], signature)).toThrowError(
			"Invalid signature",
		);
	});

	test("addVote: Votes are counted correctly", async () => {
		let count = 0;
		for (let i = 0; i < N; i++) {
			const signature = stores[i].signWithBls(finalityState.data);
			finalityState.addVote(peers[i], signature);
			count++;
			expect(finalityState.numberOfVotes).toEqual(count);
		}
		for (let i = 0; i < count; i++) {
			expect(finalityState.aggregation_bits.get(i)).toEqual(true);
		}
	});

	test("Duplicated votes", async () => {
		finalityState.addVote(peers[0], stores[0].signWithBls(finalityState.data));
		finalityState.addVote(peers[0], stores[0].signWithBls(finalityState.data));
		expect(finalityState.numberOfVotes).toEqual(1);
	});
});

describe("Tests for FinalityStore", () => {
	const N = 1000;
	let finalityStore: FinalityStore;
	const peers: string[] = [];
	const stores: DRPCredentialStore[] = [];

	const generateAttestation = (index: number, hash: string) => {
		return {
			data: hash,
			signature: stores[index].signWithBls(hash),
		};
	};

	beforeEach(async () => {
		finalityStore = new FinalityStore({ finality_threshold: 0.51 });

		for (let i = 0; i < N; i++) {
			peers.push(
				uint8ArrayToString(crypto.getRandomValues(new Uint8Array(32)), "hex"),
			);
		}
		peers.sort();

		for (let i = 0; i < N; i++) {
			stores.push(new DRPCredentialStore());
			await stores[i].start();
		}

		const voters = new Map();
		for (let i = 0; i < N; i++) {
			voters.set(peers[i], stores[i].getPublicCredential());
		}
		finalityStore.initializeState("vertex1", voters);
		finalityStore.initializeState("vertex2", voters);
		finalityStore.initializeState("vertex3", voters);
	});

	test("Runs addVotes, canVote and voted on 100 attestations", async () => {
		for (let i = 0; i < 100; i++) {
			const peerId = peers[i];
			const hash = "vertex1";
			expect(finalityStore.canVote(peerId, hash)).toEqual(true);
			expect(finalityStore.voted(peerId, hash)).toEqual(false);

			const attestation = generateAttestation(i, hash);
			finalityStore.addVotes(peerId, [attestation]);
			expect(finalityStore.voted(peerId, hash)).toEqual(true);
		}

		// invalid peer
		finalityStore.addVotes("badNode", []);
		expect(finalityStore.getNumberOfVotes("vertex1")).toEqual(100);
	});

	test("mergeVotes: Merge votes for multiple vertices", async () => {
		const attestations: AggregatedAttestation[] = [];

		// votes for vertex1
		for (let i = 0; i < 10; i++) {
			const signature = stores[i].signWithBls("vertex1");
			const bits = new BitSet(N);
			bits.set(i, true);

			attestations.push({
				data: "vertex1",
				signature,
				aggregationBits: bits.toBytes(),
			});
		}

		// votes for vertex2
		const signatures: Uint8Array[] = [];
		const bitset = new BitSet(N);
		for (let i = 0; i < 50; i++) {
			signatures.push(stores[i].signWithBls("vertex2"));
			bitset.set(i, true);
		}
		const aggregatedSignature = bls.aggregateSignatures(signatures);
		attestations.push({
			data: "vertex2",
			signature: aggregatedSignature,
			aggregationBits: bitset.toBytes(),
		});

		// votes for vertex3
		// invalid signature
		attestations.push({
			data: "vertex3",
			signature: stores[0].signWithBls("vertex3"),
			aggregationBits: new BitSet(N).toBytes(),
		});

		finalityStore.mergeVotes(attestations);

		// the merge function only accepts the first merge
		expect(finalityStore.getNumberOfVotes("vertex1")).toEqual(1);
		expect(finalityStore.getNumberOfVotes("vertex2")).toEqual(50);
		expect(finalityStore.getAttestation("vertex2")?.signature).toEqual(
			aggregatedSignature,
		);
		expect(finalityStore.getNumberOfVotes("vertex3")).toEqual(0);
	});

	test("Quorum test", async () => {
		for (let i = 0; i < 509; i++) {
			const attestation = generateAttestation(i, "vertex1");
			finalityStore.addVotes(peers[i], [attestation]);
		}
		expect(finalityStore.isFinalized("vertex1")).toEqual(false);

		for (let i = 509; i < 510; i++) {
			const attestation = generateAttestation(i, "vertex1");
			finalityStore.addVotes(peers[i], [attestation]);
		}
		// 1000 * 0.51 = 510
		expect(finalityStore.isFinalized("vertex1")).toEqual(true);
	});
});
