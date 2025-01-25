import sys
import networkx as nx

# import matplotlib.pyplot as plt
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
    """Function to determine the attributes of a node"""
    if node_id < bootstraps:
        return (
            f"bootstrap{node_id + 1}",
            REGIONS[node_id % 8],
            "reliable",
            DEFAULT_BUILTIN_RELIABILITIES["reliable"],
            f"11.{node_id % 8}.0.{node_id // 8}",
        )
    return (
        f"node{node_id - bootstraps + 1}",
        REGIONS[(node_id - bootstraps) % 8],
        name := RELIABILITIES[(node_id - bootstraps) % 5],
        DEFAULT_BUILTIN_RELIABILITIES[name],
        f"12.{(node_id - bootstraps) % 8}.{(node_id - bootstraps) % 5}.{(node_id - bootstraps) // 8}",
    )


def generate_topology(bootstraps: int, nodes: int) -> list[str]:
    """Function to create the network topology"""
    G = nx.DiGraph()
    ips = []

    # start with bootstraps, all are reliable
    for i in range(bootstraps + nodes):
        node_name, region, rel_name, reliability, ip_addr = node_info(bootstraps, i)
        ips.append(ip_addr)
        G.add_node(i, label=f"{node_name} ({region}-{rel_name})")
        G.nodes[i]["hostbandwidthup"] = reliability["bandwidth_up"]
        G.nodes[i]["hostbandwidthdown"] = reliability["bandwidth_down"]

        for j in range(bootstraps + nodes):
            _, region_to, rel_to_name, reliability_to, _ = node_info(bootstraps, j)

            G.add_edge(i, j)
            G.edges[i, j]["latency"] = (
                str(
                    DEFAULT_BUILTIN_LATENCIES[region][region_to][0]
                    + reliability["added_latency"]
                    + reliability_to["added_latency"]
                )
                + " ms"
            )
            G.edges[i, j]["packetloss"] = round(
                reliability["added_packet_loss"] + reliability_to["added_packet_loss"],
                3,
            )
            G.edges[i, j]["label"] = f"{region}-{rel_name} to {region_to}-{rel_to_name}"

    # Display the graph
    # nx.draw(G, labels=nx.get_node_attributes(G, "label"), with_labels=True)
    # plt.show()

    nx.write_gml(G, gml_file)

    # networkx package can not write underscores
    with open(gml_file, "r", encoding="utf-8") as file:
        gml_content = file.read()

    modified_content = gml_content.replace("hostbandwidth", "host_bandwidth_")
    modified_content = modified_content.replace("packetloss", "packet_loss")

    with open(gml_file, "w", encoding="utf-8") as file:
        file.write(modified_content)

    return ips
