import { GossipSub, MeshPeer } from "@chainsafe/libp2p-gossipsub";
import { Connection, IdentifyResult, Libp2p, SubscriptionChangeData } from "@libp2p/interface";
import { loadConfig } from "@ts-drp/node/src/config.js";
import { raceEvent } from "race-event";
import { beforeAll, describe, expect, test } from "vitest";

import { NetworkPb } from "../src/index.js";
import { DRPNetworkNode, DRPNetworkNodeConfig, streamToUint8Array } from "../src/node.js";

describe("DRPNetworkNode can connect & send messages", () => {
	const controller = new AbortController();
	let node1: DRPNetworkNode;
	let node2: DRPNetworkNode;
	let libp2pNode1: Libp2p;
	let bootstrapNode: DRPNetworkNode;
	let pubsubNode1: GossipSub;

	const isDialable = async (node: DRPNetworkNode, timeout = false) => {
		let resolver: (value: boolean) => void;
		const promise = new Promise<boolean>((resolve) => {
			resolver = resolve;
		});

		if (timeout) {
			setTimeout(() => {
				resolver(false);
			}, 10);
		}

		const callback = () => {
			resolver(true);
		};

		await node.isDialable(callback);
		return await promise;
	};

	beforeAll(async () => {
		const configPath = `${__dirname}/../../../configs/local-bootstrap.json`;
		const bootstrapConfig: DRPNetworkNodeConfig = {
			...loadConfig(configPath)?.network_config,
			log_config: { level: "silent" },
		};
		bootstrapNode = new DRPNetworkNode(bootstrapConfig);
		await bootstrapNode.start();

		const bootstrapMultiaddrs = bootstrapNode.getMultiaddrs();
		const nodeConfig: DRPNetworkNodeConfig = {
			bootstrap_peers: bootstrapMultiaddrs,
			log_config: {
				level: "silent",
			},
		};
		node1 = new DRPNetworkNode({
			...nodeConfig,
			private_key_seed: "node1",
		});
		node2 = new DRPNetworkNode({
			...nodeConfig,
			private_key_seed: "node2",
		});

		await node1.start();
		const btLibp2pNode1 = (bootstrapNode as unknown as { _node: Libp2p })._node;
		libp2pNode1 = (node1 as unknown as { _node: Libp2p })._node;
		await Promise.all([
			raceEvent(btLibp2pNode1, "peer:identify", controller.signal, {
				filter: (event: CustomEvent<IdentifyResult>) =>
					event.detail.peerId.equals(libp2pNode1.peerId) && event.detail.listenAddrs.length > 0,
			}),
			isDialable(node1),
		]);

		await node2.start();
		expect(await isDialable(node2)).toBe(true);

		pubsubNode1 = (node1 as unknown as { _pubsub: GossipSub })._pubsub;
	});

	test("Node can send message to peer", async () => {
		const data = "Hello World!";
		let boolean = false;

		await raceEvent(libp2pNode1, "connection:open", controller.signal, {
			filter: (event: CustomEvent<Connection>) =>
				event.detail.remotePeer.toString() === node2.peerId && event.detail.limits === undefined,
		});

		const messageProcessed = new Promise((resolve) => {
			node2
				.addMessageHandler(async ({ stream }) => {
					const byteArray = await streamToUint8Array(stream);
					const message = NetworkPb.Message.decode(byteArray);
					expect(Buffer.from(message.data).toString("utf-8")).toBe(data);
					boolean = true;
					resolve(true);
				})
				.catch((e) => {
					console.error(e);
				});
		});

		await node1.sendMessage(node2.peerId, {
			sender: "",
			type: 0,
			data: new Uint8Array(Buffer.from(data)),
		});

		await messageProcessed;
		expect(boolean).toBe(true);
	});

	test("Node can send message to group", async () => {
		const data = "Hello Group!";
		const group = "test";
		let boolean = false;

		const graftPromise = raceEvent(pubsubNode1, "gossipsub:graft", controller.signal, {
			filter: (event: CustomEvent<MeshPeer>) => event.detail.peerId === node2.peerId,
		});

		const subscriptionChange = new Promise((resolve) => {
			raceEvent(pubsubNode1, "subscription-change", controller.signal, {
				filter: (event: CustomEvent<SubscriptionChangeData>) =>
					event.detail.subscriptions.some((s) => s.topic === group) &&
					event.detail.peerId.toString() === node2.peerId,
			})
				.then(() => resolve(true))
				.catch(() => resolve(false));
		});

		node2.subscribe(group);
		const messageProcessed = new Promise((resolve) => {
			node2.addGroupMessageHandler(group, async (e) => {
				const message = NetworkPb.Message.decode(e.detail.msg.data);
				expect(Buffer.from(message.data).toString("utf-8")).toBe(data);
				boolean = true;
				resolve(true);
			});
		});

		await Promise.all([graftPromise, subscriptionChange]);
		console.log("peers in group", pubsubNode1.getSubscribers(group));
		await node1.broadcastMessage(group, {
			sender: "",
			type: 0,
			data: new Uint8Array(Buffer.from(data)),
		});
		await messageProcessed;

		expect(boolean).toBe(true);
	}, 10000);
});
