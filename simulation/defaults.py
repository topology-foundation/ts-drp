"""Module containing default values for latencies and reliabilities."""

REGIONS = [
    "australia",
    "east_asia",
    "europe",
    "na_west",
    "na_east",
    "south_america",
    "south_africa",
    "west_asia",
]

# latency, jitter
DEFAULT_BUILTIN_LATENCIES = {
    "australia": {
        "australia": (2, 0.0),
        "east_asia": (110, 0.0),
        "europe": (165, 0.0),
        "na_west": (110, 0.0),
        "na_east": (150, 0.0),
        "south_america": (190, 0.0),
        "south_africa": (220, 0.0),
        "west_asia": (180, 0.0),
    },
    "east_asia": {
        "australia": (110, 0.0),
        "east_asia": (4, 0.0),
        "europe": (125, 0.0),
        "na_west": (100, 0.0),
        "na_east": (140, 0.0),
        "south_america": (175, 0.0),
        "south_africa": (175, 0.0),
        "west_asia": (110, 0.0),
    },
    "europe": {
        "australia": (165, 0.0),
        "east_asia": (125, 0.0),
        "europe": (2, 0.0),
        "na_west": (110, 0.0),
        "na_east": (70, 0.0),
        "south_america": (140, 0.0),
        "south_africa": (95, 0.0),
        "west_asia": (60, 0.0),
    },
    "na_west": {
        "australia": (110, 0.0),
        "east_asia": (100, 0.0),
        "europe": (110, 0.0),
        "na_west": (2, 0.0),
        "na_east": (60, 0.0),
        "south_america": (100, 0.0),
        "south_africa": (160, 0.0),
        "west_asia": (150, 0.0),
    },
    "na_east": {
        "australia": (150, 0.0),
        "east_asia": (140, 0.0),
        "europe": (70, 0.0),
        "na_west": (60, 0.0),
        "na_east": (2, 0.0),
        "south_america": (100, 0.0),
        "south_africa": (130, 0.0),
        "west_asia": (110, 0.0),
    },
    "south_america": {
        "australia": (190, 0.0),
        "east_asia": (175, 0.0),
        "europe": (140, 0.0),
        "na_west": (100, 0.0),
        "na_east": (100, 0.0),
        "south_america": (7, 0.0),
        "south_africa": (195, 0.0),
        "west_asia": (145, 0.0),
    },
    "south_africa": {
        "australia": (220, 0.0),
        "east_asia": (175, 0.0),
        "europe": (95, 0.0),
        "na_west": (160, 0.0),
        "na_east": (130, 0.0),
        "south_america": (190, 0.0),
        "south_africa": (7, 0.0),
        "west_asia": (110, 0.0),
    },
    "west_asia": {
        "australia": (180, 0.0),
        "east_asia": (110, 0.0),
        "europe": (60, 0.0),
        "na_west": (150, 0.0),
        "na_east": (110, 0.0),
        "south_america": (145, 0.0),
        "south_africa": (110, 0.0),
        "west_asia": (5, 0.0),
    },
}

RELIABILITIES = [
    "reliable",
    "home",
    "laggy",
    "constrained",
    "bad",
]

DEFAULT_BUILTIN_RELIABILITIES = {
    "reliable": {
        "added_latency": 0,
        "added_packet_loss": 0.0,
        "bandwidth_up": "1 Gbit",
        "bandwidth_down": "1 Gbit",
    },
    "home": {
        "added_latency": 20,
        "added_packet_loss": 0.001,
        "bandwidth_up": "50 Mbit",
        "bandwidth_down": "50 Mbit",
    },
    "laggy": {
        "added_latency": 300,
        "added_packet_loss": 0.05,
        "bandwidth_up": "50 Mbit",
        "bandwidth_down": "50 Mbit",
    },
    "constrained": {
        "added_latency": 20,
        "added_packet_loss": 0.001,
        "bandwidth_up": "5 Mbit",
        "bandwidth_down": "5 Mbit",
    },
    "bad": {
        "added_latency": 500,
        "added_packet_loss": 0.2,
        "bandwidth_up": "2 Mbit",
        "bandwidth_down": "2 Mbit",
    },
}
