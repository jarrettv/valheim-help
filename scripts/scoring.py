import json

# Path to the input JSON file
input_file = "out/trophies.json"
output_file = "out/trophies_extracted.json"


# Function to extract id, score, and add a blank code field
def extract_trophy_data(input_file, output_file):
    # Read JSON data from file
    with open(input_file, "r") as f:
        trophies = json.load(f)

    # Extract necessary fields and add blank code
    extracted_data = []
    for trophy in trophies:
        extracted_data.append(
            {
                "id": trophy.get("id"),
                "code": "Trophy" + trophy.get("name").replace(" ", ""),
                "score": trophy.get("score"),
            }
        )

    # Write the extracted data to a new file
    with open(output_file, "w") as f:
        json.dump(extracted_data, f, indent=4)

    print(f"Extracted data saved to {output_file}")


# Execute the extraction
extract_trophy_data(input_file, output_file)
