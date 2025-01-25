#!/usr/bin/env python3
import os
import argparse
import networkx as nx
from gen_topology import generate_topology


parser = argparse.ArgumentParser(prog="gen_config", description="Generate shadow.yaml")
parser.add_argument(
    "-n",
    "--nodes",
    help="Number of nodes in the network",
    type=int,
    default=8,
)
parser.add_argument(
    "-b",
    "--bootstraps",
    help="Number of bootstrap nodes in the network (<= 8)",
    type=int,
    default=1,
)
parser.add_argument(
    "-f",
    "--file",
    help="Output .yaml file",
    type=str,
    default="shadow.yaml",
)

args = parser.parse_args()

DIRNAME = os.path.dirname(os.path.abspath(__file__))

ip_addrs = generate_topology(args.bootstraps, args.nodes)
assert os.path.exists("network_topology.gml")

with open(args.file, "w", encoding="utf8") as f:
    f.write(
        """general:
  bootstrap_end_time: 10s
  heartbeat_interval: 10s
  stop_time: 1min
  progress: true
  model_unblocked_syscall_latency: true
network:
  use_shortest_path: false
  graph:
    type: gml
    file:
      path: network_topology.gml

hosts:
"""
    )

    bootstrap_addresses = []
    for i in range(args.bootstraps):
        ip_addr = ip_addrs[i]
        bootstrap_addresses.append(ip_addr)
        f.write(
            f"""  bootstrap{i+1}:
    ip_addr: {ip_addr}
    network_node_id: {i}
    processes:
    - path: /usr/bin/node
      args: {DIRNAME}/generic_node.js -s bootstrap{i+1} --ips {ip_addr}
      environment:
        DEBUG: "libp2p:*error"
      expected_final_state: running
"""
        )

    for i in range(args.nodes):
        ip_addr = ip_addrs[args.bootstraps + i]
        f.write(
            f"""  node{i+1}:
    ip_addr: {ip_addr}
    network_node_id: {args.bootstraps + i}
    processes:
    - path: /usr/bin/node
      args: {DIRNAME}/generic_node.js -s node{i+1} --ips {",".join(bootstrap_addresses)}
      environment:
        DEBUG: "libp2p:*error"
      start_time: 5s
      expected_final_state: running
"""
        )
