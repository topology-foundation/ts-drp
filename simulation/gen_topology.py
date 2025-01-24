import sys
import math
import networkx as nx
from defaults import (
    REGIONS,
    DEFAULT_BUILTIN_LATENCIES,
    RELIABILITIES,
    DEFAULT_BUILTIN_RELIABILITIES,
)

gml_file = "network_topology.gml"

# there are 8 regions and 5 reliability values, each node should have at least one bootstrap node
# this gives us 8 * 5 + 8 = 48 nodes

assert len(REGIONS) == 8
assert len(DEFAULT_BUILTIN_RELIABILITIES) == 5


def node_info(bootstraps: int, node_id: int):
    """Function to determine the region and reliability of a node"""
    if node_id < bootstraps:
        return (
            f"bootstrap{node_id + 1}",
            REGIONS[node_id % 8],
            "reliable",
            DEFAULT_BUILTIN_RELIABILITIES["reliable"],
        )
    return (
        f"node{node_id - bootstraps + 1}",
        REGIONS[(node_id - bootstraps) % 8],
        name := RELIABILITIES[(node_id - bootstraps) % 5],
        DEFAULT_BUILTIN_RELIABILITIES[name],
    )


def generate_topology(bootstraps: int, nodes: int):
    """Function to create the network topology"""
    G = nx.complete_graph(bootstraps + nodes)

    # start with bootstraps, all are reliable
    for i in range(bootstraps + nodes):
        node_name, region, rel_name, reliability = node_info(bootstraps, i)

        G.nodes[i]["label"] = f"{node_name} ({region})"
        G.nodes[i]["hostbandwidthup"] = reliability["bandwidth_up"]
        G.nodes[i]["hostbandwidthdown"] = reliability["bandwidth_down"]

        G.add_edge(i, i)
        G.edges[i, i]["latency"] = (
            str(
                DEFAULT_BUILTIN_LATENCIES[region][region][0]
                + 2 * reliability["added_latency"]
            )
            + " ms"
        )
        G.edges[i, i]["packetloss"] = 2 * reliability["added_packet_loss"]
        G.edges[i, i]["label"] = f"{region}-{rel_name} to {region}-{rel_name}"

        for j in range(i + 1, bootstraps + nodes):
            _, region_to, rel_to_name, reliability_to = node_info(bootstraps, j)

            G.edges[i, j]["latency"] = (
                str(
                    DEFAULT_BUILTIN_LATENCIES[region][region_to][0]
                    + reliability["added_latency"]
                    + reliability_to["added_latency"]
                )
                + " ms"
            )
            G.edges[i, j]["packetloss"] = (
                reliability["added_packet_loss"] + reliability_to["added_packet_loss"]
            )
            G.edges[i, j]["label"] = f"{region}-{rel_name} to {region_to}-{rel_to_name}"

    nx.write_gml(G, gml_file)

    # networkx package can not write underscores
    with open(gml_file, "r") as file:
        gml_content = file.read()

    modified_content = gml_content.replace("hostbandwidth", "host_bandwidth_")
    modified_content = modified_content.replace("packetloss", "packet_loss")

    with open(gml_file, "w") as file:
        file.write(modified_content)
