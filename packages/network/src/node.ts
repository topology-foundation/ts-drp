import {
	type GossipsubEvents,
	type GossipsubMessage,
	gossipsub,
} from "@chainsafe/libp2p-gossipsub";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { autoNAT } from "@libp2p/autonat";
import { bootstrap } from "@libp2p/bootstrap";
import {
	circuitRelayServer,
	circuitRelayTransport,
} from "@libp2p/circuit-relay-v2";
import { generateKeyPairFromSeed } from "@libp2p/crypto/keys";
import { dcutr } from "@libp2p/dcutr";
import { devToolsMetrics } from "@libp2p/devtools-metrics";
import { identify } from "@libp2p/identify";
import type {
	EventCallback,
	PubSub,
	Stream,
	StreamHandler,
} from "@libp2p/interface";
import { pubsubPeerDiscovery } from "@libp2p/pubsub-peer-discovery";
import { webRTC, webRTCDirect } from "@libp2p/webrtc";
import { webSockets } from "@libp2p/websockets";
import * as filters from "@libp2p/websockets/filters";
import { webTransport } from "@libp2p/webtransport";
import { multiaddr } from "@multiformats/multiaddr";
import type { LoggerOptions } from "@topology-foundation/logger";
import { type Libp2p, createLibp2p } from "libp2p";
import loglevel from "loglevel";
import prefix from "loglevel-plugin-prefix";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { Message } from "./proto/messages_pb.js";
import { uint8ArrayToStream } from "./stream.js";

export * from "./stream.js";

let log: loglevel.Logger;

// snake_casing to match the JSON config
export interface TopologyNetworkNodeConfig {
	addresses?: string[];
	bootstrap?: boolean;
	bootstrap_peers?: string[];
	browser_metrics?: boolean;
	private_key_seed?: string;
	log_config?: LoggerOptions;
}

export class TopologyNetworkNode {
	private _config?: TopologyNetworkNodeConfig;
	private _node?: Libp2p;
	private _pubsub?: PubSub<GossipsubEvents>;

	peerId = "";

	constructor(config?: TopologyNetworkNodeConfig) {
		this._config = config;
		log = loglevel.getLogger("topology::network");
		log.setLevel(
			(this._config?.log_config?.level as loglevel.LogLevelDesc) || "info",
		);
		prefix.reg(loglevel);
		prefix.apply(log, {
			template: "%n",
		});
	}

	async start() {
		let privateKey = undefined;
		if (this._config?.private_key_seed) {
			const tmp = this._config.private_key_seed.padEnd(32, "0");
			privateKey = await generateKeyPairFromSeed(
				"Ed25519",
				uint8ArrayFromString(tmp),
			);
		}

		const _bootstrapNodesList = this._config?.bootstrap_peers
			? this._config.bootstrap_peers
			: [
					"/dns4/relay.droak.sh/tcp/443/wss/p2p/Qma3GsJmB47xYuyahPZPSadh1avvxfyYQwk8R3UnFrQ6aP",
				];

		const _pubsubPeerDiscovery = pubsubPeerDiscovery({
			interval: 10_000,
			topics: ["topology::discovery"],
		});

		const _peerDiscovery = _bootstrapNodesList.length
			? [
					_pubsubPeerDiscovery,
					bootstrap({
						list: _bootstrapNodesList,
					}),
				]
			: [_pubsubPeerDiscovery];

		this._node = await createLibp2p({
			privateKey,
			addresses: {
				listen: this._config?.addresses ? this._config.addresses : ["/webrtc"],
			},
			connectionEncrypters: [noise()],
			connectionGater: {
				denyDialMultiaddr: () => {
					return false;
				},
			},
			metrics: this._config?.browser_metrics ? devToolsMetrics() : undefined,
			peerDiscovery: _peerDiscovery,
			services: {
				autonat: autoNAT(),
				dcutr: dcutr(),
				identify: identify(),
				pubsub: gossipsub(),
			},
			streamMuxers: [yamux()],
			transports: [
				circuitRelayTransport({
					discoverRelays: 2,
					reservationConcurrency: 1,
				}),
				webRTC(),
				webRTCDirect(),
				webSockets({
					filter: filters.all,
				}),
				webTransport(),
			],
		});

		if (this._config?.bootstrap)
			this._node.services.relay = circuitRelayServer();

		if (!this._config?.bootstrap) {
			for (const addr of this._config?.bootstrap_peers || []) {
				this._node.dial(multiaddr(addr));
			}
		}

		this._pubsub = this._node.services.pubsub as PubSub<GossipsubEvents>;
		this.peerId = this._node.peerId.toString();

		log.info(
			"::start: Successfuly started topology network w/ peer_id",
			this.peerId,
		);

		this._node.addEventListener("peer:connect", (e) =>
			log.info("::start::peer::connect", e.detail),
		);
		this._node.addEventListener("peer:discovery", (e) => {
			// current bug in v11.0.0 requires manual dial (https://github.com/libp2p/js-libp2p-pubsub-peer-discovery/issues/149)
			for (const ma of e.detail.multiaddrs) {
				this._node?.dial(ma);
			}
			log.info("::start::peer::discovery", e.detail);
		});
		this._node.addEventListener("peer:identify", (e) =>
			log.info("::start::peer::identify", e.detail),
		);
	}

	subscribe(topic: string) {
		if (!this._node) {
			log.error("::subscribe: Node not initialized, please run .start()");
			return;
		}

		try {
			this._pubsub?.subscribe(topic);
			this._pubsub?.getPeers();
			log.info("::subscribe: Successfuly subscribed the topic", topic);
		} catch (e) {
			log.error("::subscribe:", e);
		}
	}

	unsubscribe(topic: string) {
		if (!this._node) {
			log.error("::unsubscribe: Node not initialized, please run .start()");
			return;
		}

		try {
			this._pubsub?.unsubscribe(topic);
			log.info("::unsubscribe: Successfuly unsubscribed the topic", topic);
		} catch (e) {
			log.error("::unsubscribe:", e);
		}
	}

	getAllPeers() {
		const peers = this._node?.getPeers();
		if (!peers) return [];
		return peers.map((peer) => peer.toString());
	}

	getGroupPeers(group: string) {
		const peers = this._pubsub?.getSubscribers(group);
		if (!peers) return [];
		return peers.map((peer) => peer.toString());
	}

	async broadcastMessage(topic: string, message: Message) {
		try {
			const messageBuffer = Message.encode(message).finish();
			await this._pubsub?.publish(topic, messageBuffer);

			log.info(
				"::broadcastMessage: Successfuly broadcasted message to topic",
				topic,
			);
		} catch (e) {
			log.error("::broadcastMessage:", e);
		}
	}

	async sendMessage(peerId: string, protocols: string[], message: Message) {
		try {
			const connection = await this._node?.dial([multiaddr(`/p2p/${peerId}`)]);
			const stream = <Stream>await connection?.newStream(protocols);
			const messageBuffer = Message.encode(message).finish();
			uint8ArrayToStream(stream, messageBuffer);
		} catch (e) {
			log.error("::sendMessage:", e);
		}
	}

	async sendGroupMessageRandomPeer(
		group: string,
		protocols: string[],
		message: Message,
	) {
		try {
			const peers = this._pubsub?.getSubscribers(group);
			if (!peers || peers.length === 0) throw Error("Topic wo/ peers");
			const peerId = peers[Math.floor(Math.random() * peers.length)];

			const connection = await this._node?.dial(peerId);
			const stream: Stream = (await connection?.newStream(protocols)) as Stream;
			const messageBuffer = Message.encode(message).finish();
			uint8ArrayToStream(stream, messageBuffer);
		} catch (e) {
			log.error("::sendMessageRandomTopicPeer:", e);
		}
	}

	addGroupMessageHandler(
		group: string,
		handler: EventCallback<CustomEvent<GossipsubMessage>>,
	) {
		this._pubsub?.addEventListener("gossipsub:message", (e) => {
			if (group && e.detail.msg.topic !== group) return;
			handler(e);
		});
	}

	addMessageHandler(protocol: string | string[], handler: StreamHandler) {
		this._node?.handle(protocol, handler);
	}
}
