#!/usr/bin/env python3
import os
import re

patterns = {
    "received_message": re.compile(
        r"Received message from (?P<peer_id>[A-Za-z0-9]+) : Message number (?P<message_num>\d+) from \1 , at (?P<timestamp>\d+)"
    ),
    "send_message": re.compile(
        r"Sending message number (?P<message_num>\d+) from (?P<peer_id>[A-Za-z0-9]+) at (?P<timestamp>\d+)"
    ),
}

DIRNAME = os.path.dirname(os.path.abspath(__file__))
assert os.path.exists(
    os.path.join(DIRNAME, "shadow.data")
), "shadow.data directory not found"
LOG_DIR = os.path.join(DIRNAME, "shadow.data/hosts")

messages_sent = {}
messages_received = {}
nodes = []


def process_log_file(file_path):
    """Process a single log file"""
    node_name = os.path.basename(os.path.dirname(file_path))  # Extract node name
    nodes.append(node_name)
    print(f"Processing {node_name}...")
    with open(file_path, "r", encoding="utf8") as file:
        for line in file:
            for key, pattern in patterns.items():
                match = pattern.match(line)
                if match:
                    if key == "send_message":
                        messages_sent.setdefault(node_name, []).append(
                            match.groupdict()
                        )
                    elif key == "received_message":
                        messages_received.setdefault(node_name, []).append(
                            match.groupdict()
                        )


def process_logs(directory):
    """Process all log files in the given directory"""
    for root, _, files in os.walk(directory):
        for file in files:
            if file == "node.1000.stdout":  # Only process stdout files
                file_path = os.path.join(root, file)
                process_log_file(file_path)


process_logs(LOG_DIR)

print("\n\nMessages sent:")
for node, messages in messages_sent.items():
    print(f"\nNode {node}:")
    for message in messages:
        print(message)
print("\n\nMessages received:")
for node, messages in messages_received.items():
    print(f"\nNode {node}:")
    for message in messages:
        print(message)
