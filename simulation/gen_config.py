#!/usr/bin/env python3
import os
import sys
import argparse
from defaults import DEFAULT_BUILTIN_LATENCIES, DEFAULT_BUILTIN_RELIABILITIES


parser = argparse.ArgumentParser(prog="gen_config", description="Generate shadow.yaml")
parser.add_argument(
    "-n",
    "--nodes",
    help="Number of nodes in the network",
    type=int,
    default=10,
)
parser.add_argument(
    "-b",
    "--bootstraps",
    help="Number of bootstrap nodes in the network (< 8)",
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


with open(args.file, "w", encoding="utf8") as f:
    f.write(
        """general:
  bootstrap_end_time: 10s
  heartbeat_interval: 10s
  stop_time: 1min
  progress: true
  model_unblocked_syscall_latency: true
network:
  graph:
    type: 1_gbit_switch

hosts:
"""
    )

    for i in range(args.bootstraps):
        ip_addr = f"20.28.234.{i+1}"
        f.write(
            f"""  bootstrap{i+1}:
    ip_addr: {ip_addr}
    network_node_id: 0
    processes:
    - path: /usr/bin/node
      args: {DIRNAME}/generic_node.js -s bootstrap{i+1} --ips {ip_addr}
      environment:
        DEBUG: "libp2p:*error"
      expected_final_state: running
"""
        )

    for i in range(args.nodes - (args.bootstraps)):
        f.write(
            f"""  node{i+1}:
    ip_addr: 84.168.{(i + 1) // 256}.{(i + 1) % 256}
    network_node_id: 0
    processes:
    - path: /usr/bin/node
      args: {DIRNAME}/generic_node.js -s node{i+1} --ips {ip_addr}
      environment:
        DEBUG: "libp2p:*error"
      start_time: 5s
      expected_final_state: running
"""
        )
