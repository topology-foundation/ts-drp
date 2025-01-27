import { AddMulDRP } from "@topology-foundation/blueprints/src/AddMul/index.js";
import {} from "@topology-foundation/blueprints/src/TextBuffer2/index.js";
import { ObjectACL } from "@topology-foundation/object/src/index.js";
import { describe, test } from "vitest";
import { DRPNode } from "../src/index.js";

describe("AddMulDRP", () => {
	const delay = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	test("two nodes can communicate and modify the shared state", async () => {
		// Create two nodes
		const node1 = new DRPNode({
			network_config: {
				listen_addresses: ["/ip4/0.0.0.0/tcp/0/ws"],
				bootstrap_peers: [],
				private_key_seed: "add_mul_test_1",
			},
		});
		const node2 = new DRPNode({
			network_config: {
				listen_addresses: ["/ip4/0.0.0.0/tcp/0/ws"],
				bootstrap_peers: [],
				private_key_seed: "add_mul_test_2",
			},
		});

		// Start both nodes
		await node1.start();
		await node2.start();
		await Promise.all([
			node1.networkNode.isDiablable(),
			node2.networkNode.isDiablable(),
		]);

		const acl = new ObjectACL({
			admins: new Map([
				[node1.networkNode.peerId, node1.credentialStore.getPublicCredential()],
				[node2.networkNode.peerId, node2.credentialStore.getPublicCredential()],
			]),
		});

		// Connect the nodes
		const addrs = node2.networkNode.getMultiaddrs();
		if (!addrs || addrs.length === 0) {
			throw new Error("Node 2 has no multiaddrs");
		}
		await node1.networkNode.connect(addrs);

		// Subscribe to a common topic for the DRP
		const topic = "test-add-mul";
		const drp1 = await node1.createObject({
			drp: new AddMulDRP(node1.networkNode.peerId),
			id: topic,
			acl,
			sync: {
				enabled: true,
			},
		});

		const drp2 = await node2.createObject({
			drp: new AddMulDRP(node2.networkNode.peerId),
			id: topic,
			acl,
			sync: {
				enabled: true,
			},
		});

		await node1.networkNode.isSubscribed(
			topic,
			node2.networkNode.libp2pPeerId(),
		);
		await node2.networkNode.isSubscribed(
			topic,
			node1.networkNode.libp2pPeerId(),
		);

		const addMul1 = drp1.drp as AddMulDRP;
		const addMul2 = drp2.drp as AddMulDRP;

		try {
			addMul1.add(5);
		} catch (error) {
			console.error("Error in add operation:", error);
		}
		console.log("Before setTimeout...");
		//await delay(1000);
		console.log("After setTimeout...");

		// Verify both nodes have the same value
		//expect(addMul1.query_value()).toBe(5);
		//expect(addMul2.query_value()).toBe(5);
		console.log("2".repeat(1000));

		console.log("addMul", addMul1.query_value());
		console.log("addMul", addMul2.query_value());

		//// Node 2 performs multiply operation
		addMul2.mul(3);
		//addMul1.add(10);
		//console.log("Before setTimeout...");
		await delay(5000);
		//console.log("After setTimeout...");

		//// Verify both nodes have the same value
		//expect(addMul1.query_value()).toBe(45);
		//expect(addMul2.query_value()).toBe(45);
		console.log("addMul", addMul1.query_value());
		console.log("addMul", addMul2.query_value());

		// Clean up
		await node1.networkNode.stop();
		await node2.networkNode.stop();
	}, 20000);

	//test("text buffer 1233", async () => {
	//	// Create two nodes
	//	const node1 = new DRPNode({
	//		network_config: {
	//			listen_addresses: ["/ip4/0.0.0.0/tcp/0/ws"],
	//			bootstrap_peers: [],
	//			private_key_seed: "add_mul_test_1",
	//		},
	//	});
	//	const node2 = new DRPNode({
	//		network_config: {
	//			listen_addresses: ["/ip4/0.0.0.0/tcp/0/ws"],
	//			bootstrap_peers: [],
	//			private_key_seed: "add_mul_test_2",
	//		},
	//	});

	//	// Start both nodes
	//	await node1.start();
	//	await node2.start();
	//	await Promise.all([
	//		node1.networkNode.isDiablable(),
	//		node2.networkNode.isDiablable(),
	//	]);

	//	const acl = new ObjectACL({
	//		admins: new Map([
	//			[node1.networkNode.peerId, node1.credentialStore.getPublicCredential()],
	//			[node2.networkNode.peerId, node2.credentialStore.getPublicCredential()],
	//		]),
	//	});

	//	// Connect the nodes
	//	const addrs = node2.networkNode.getMultiaddrs();
	//	if (!addrs || addrs.length === 0) {
	//		throw new Error("Node 2 has no multiaddrs");
	//	}
	//	await node1.networkNode.connect(addrs);

	//	// Subscribe to a common topic for the DRP
	//	const topic = "test-add-mul";
	//	const drp1 = await node1.createObject({
	//		drp: new TextBuffer(node1.networkNode.peerId),
	//		id: topic,
	//		acl,
	//		sync: {
	//			enabled: true,
	//		},
	//	});

	//	const drp2 = await node2.createObject({
	//		drp: new TextBuffer(node2.networkNode.peerId),
	//		id: topic,
	//		acl,
	//		sync: {
	//			enabled: true,
	//		},
	//	});

	//	await node1.networkNode.isSubscribed(
	//		topic,
	//		node2.networkNode.libp2pPeerId(),
	//	);
	//	await node2.networkNode.isSubscribed(
	//		topic,
	//		node1.networkNode.libp2pPeerId(),
	//	);

	//	const addMul1 = drp1.drp as TextBuffer;
	//	const addMul2 = drp2.drp as TextBuffer;

	//	addMul1.insert(0, "hello", node1.networkNode.peerId);
	//	await delay(1000);

	//	// Verify both nodes have the same value
	//	expect(addMul1.query_text()).toBe("hello");
	//	expect(addMul2.query_text()).toBe("hello");
	//	await delay(1000);
	//	console.log("-".repeat(100));

	//	// Node 2 performs multiply operation
	//	console.log("will send insert");
	//	addMul1.insert(5, "peer1", node1.networkNode.peerId);
	//	addMul2.insert(5, "peer2", node2.networkNode.peerId);
	//	await delay(1000);

	//	// Verify both nodes have the same value
	//	console.log(
	//		JSON.stringify(addMul1.query_content(), null, 2),
	//		JSON.stringify(addMul2.query_content(), null, 2),
	//	);
	//	const content: Insert[] = [
	//		{
	//			id: {
	//				peerId: node1.networkNode.peerId,
	//				clock: 0,
	//			},
	//			content: "hello",
	//			parent: null,
	//			counter: 0,
	//			color: "red",
	//		},
	//		{
	//			id: {
	//				peerId: node2.networkNode.peerId,
	//				clock: 0,
	//			},
	//			content: "peer2",
	//			parent: {
	//				peerId: node1.networkNode.peerId,
	//				clock: 4,
	//			},
	//			counter: 0,
	//			color: "red",
	//		},
	//		{
	//			id: {
	//				peerId: node1.networkNode.peerId,
	//				clock: 5,
	//			},
	//			content: "peer1",
	//			parent: {
	//				peerId: node1.networkNode.peerId,
	//				clock: 4,
	//			},
	//			counter: 0,
	//			color: "red",
	//		},
	//	];

	//	console.log("peerID 1", node1.networkNode.peerId);
	//	console.log("peerID 2", node2.networkNode.peerId);
	//	console.log("peer at pos 1", addMul1.query_content()[1].id.peerId);
	//	console.log("peer at pos 1", addMul2.query_content()[1].id.peerId);
	//	expect(addMul1.query_content()).toEqual(content);
	//	expect(addMul2.query_content()).toEqual(content);

	//	// Clean up
	//	await node1.networkNode.stop();
	//	await node2.networkNode.stop();
	//}, 20000);
});
