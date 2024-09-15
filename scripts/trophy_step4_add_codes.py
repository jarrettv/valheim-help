import json

# Define file paths
trophies_file = "out/trophies.json"
trophies_extracted_file = "out/trophies_extracted.json"
output_file = "out/trophies_codes.json"


# Function to match trophies and add the code
def add_trophy_code():
    # Read the trophies data from trophies.json
    with open(trophies_file, "r") as f:
        trophies_data = json.load(f)

    # Read the extracted trophies data from trophies_extracted.json
    with open(trophies_extracted_file, "r") as f:
        extracted_data = json.load(f)

    # Create a dictionary of extracted trophies with id as the key for quick lookup
    extracted_dict = {trophy["id"]: trophy["code"] for trophy in extracted_data}

    # Add the code to the corresponding trophy in trophies.json
    for trophy in trophies_data:
        trophy_id = trophy["id"]
        if trophy_id in extracted_dict:
            trophy["code"] = extracted_dict[trophy_id]
        else:
            print(f"Code not found for {trophy_id}")
            trophy["code"] = None  # Set to None if no match is found

    # Write the updated data to a new file
    with open(output_file, "w") as f:
        json.dump(trophies_data, f, indent=2)


# Run the function
if __name__ == "__main__":
    add_trophy_code()
    print(f"Updated trophies saved to {output_file}")
