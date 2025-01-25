import { DRPNode } from "@ts-drp/node";
import { NetworkPb } from "@ts-drp/network";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { Command, Option } from "commander";
import { assert } from "node:console";
import * as fs from "fs";

export const program = new Command()
program.version("0.0.1")

program.addOption(new Option("-s, --seed <seed>", "Private key seed"))
program.addOption(new Option("--ips <list>", "Comma-separated list of IP addresses (one if bootstrap)"))

program.parse(process.args);
const opts = program.opts();

const ipAddressesArray = opts.ips ? opts.ips.split(',').map(ip => ip.trim()) : []

assert(ipAddressesArray.length > 0, "Must pass at least one ip addr")
let config = {}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


if (!opts.seed.startsWith("bootstrap")) {
    const bootstrapPeers = []
    const peerIds = fs.readFileSync(`${__dirname}/bootstrap_peerids.txt`).toString().split("\n")
    for (let i = 0; i < ipAddressesArray.length; i++) {
        bootstrapPeers.push(`/ip4/${ipAddressesArray[i]}/tcp/50000/ws/p2p/${peerIds[i].split(" ")[1]}`)
    }
    config = {
        network_config: {
            bootstrap_peers: bootstrapPeers,
            private_key_seed: opts.seed
        }
    }
} else {
    config = {
        network_config: {
            listen_addresses: ["/ip4/0.0.0.0/tcp/50000/ws", "/ip4/0.0.0.0/tcp/50001"],
            announce_addresses: [`/ip4/${ipAddressesArray[0]}/tcp/50000/ws`, `/ip4/${ipAddressesArray[0]}/tcp/50001`],
            bootstrap: true,
            bootstrap_peers: [],
            private_key_seed: opts.seed
        }
    }
}

const group = "simulation"

const node = new DRPNode(config)
await node.start()

node.networkNode.subscribe(group)

node.networkNode.addGroupMessageHandler(group, async (e) => {
    const message = NetworkPb.Message.decode(e.detail.msg.data)
    const messageData = Buffer.from(message.data).toString("utf-8")
    const sender = Buffer.from(message.sender).toString("utf-8")
    console.log(`Received message from ${sender} : ${messageData} , at ${Date.now()}`)
})


if (!opts.seed.startsWith("bootstrap")) {
    let count = 0
    setInterval(() => {
        console.log(`Sending message number ${count} from ${node.networkNode.peerId} at ${Date.now()}`)
        node.networkNode.broadcastMessage(group, {
            sender: node.networkNode.peerId,
            type: 0,
            data: new Uint8Array(Buffer.from(`Message number ${count} from ${node.networkNode.peerId}`))
        })
        count++;
    }, 5000)
}