import json
import argparse
import sys


# Function to load mappings from trophies_extracted.json
def load_trophy_mappings(file_path):
    with open(file_path, "r") as f:
        trophies = json.load(f)

    # Create a dictionary mapping id to code
    trophy_mapping = {trophy["id"]: trophy["code"] for trophy in trophies}
    return trophy_mapping


# Function to get trophy codes based on the input trophy IDs
def get_trophy_codes(trophy_ids, trophy_mapping):
    trophy_codes = []

    for trophy_id in trophy_ids:
        # Get the corresponding trophy code or 'Unknown' if the ID is not in the mapping
        trophy_code = trophy_mapping.get(trophy_id, "Unknown")
        trophy_codes.append(trophy_code)

    return trophy_codes


# Main function to handle command-line input and output
def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(
        description="Get trophy codes from a JSON array of trophy IDs"
    )

    # Optional argument for the JSON file with a default value
    parser.add_argument(
        "-f",
        "--file",
        type=str,
        default="out/trophies_extracted.json",
        help="Path to the trophies_extracted.json file (default: out/trophies_extracted.json)",
    )

    # Argument for the JSON array of trophy IDs
    parser.add_argument(
        "trophy_ids_json",
        type=str,
        help='A JSON array of trophy IDs (e.g., \'["deer_trophy", "boar_trophy"]\')',
    )

    # Parse arguments
    args = parser.parse_args()

    # Parse the trophy IDs from the provided JSON array
    try:
        trophy_ids = json.loads(args.trophy_ids_json)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON array: {e}", file=sys.stderr)
        sys.exit(1)

    if not isinstance(trophy_ids, list):
        print("Input should be a JSON array of trophy IDs.", file=sys.stderr)
        sys.exit(1)

    # Load the trophy mappings
    trophy_mapping = load_trophy_mappings(args.file)

    # Get the trophy codes for the input IDs
    trophy_codes_output = get_trophy_codes(trophy_ids, trophy_mapping)

    # Output the trophy codes as a comma-separated list
    print(",".join(trophy_codes_output))


# Execute the script
if __name__ == "__main__":
    main()
