import { DRPNode } from "@ts-drp/node";
import { Command, Option } from "commander";
import { assert } from "node:console";

export const program = new Command()
program.version("0.0.1")

program.addOption(new Option("-s, --seed <seed>", "Private key seed"))
program.addOption(new Option("--ips <list>", "Comma-separated list of IP addresses (one if bootstrap)"))

program.parse(process.args);
const opts = program.opts();

const ipAddressesArray = opts.ips ? opts.ips.split(',').map(ip => ip.trim()) : []

assert(ipAddressesArray.length > 0, "Must pass at least one ip addr")
let config = {}

if (!opts.seed.startsWith("bootstrap")) {
    config = {
        network_config: {
            bootstrap_peers: [
                `/ip4/${ipAddressesArray[0]}/tcp/50000/ws/p2p/12D3KooWC6sm9iwmYbeQJCJipKTRghmABNz1wnpJANvSMabvecwJ`
            ],
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

const node = new DRPNode(config)
await node.start()