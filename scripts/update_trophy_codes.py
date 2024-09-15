import json
import os

# Define file paths
trophies_extracted_file = "out/trophies_extracted.json"
input_folder = "../src/content/trophy"  # Folder with individual trophy JSON files


# Function to match trophies and add the code to individual files
def add_trophy_code_to_files():
    # Read the extracted trophies data from trophies_extracted.json
    with open(trophies_extracted_file, "r") as f:
        extracted_data = json.load(f)

    # Create a dictionary of extracted trophies with id as the key for quick lookup
    extracted_dict = {trophy["id"]: trophy["code"] for trophy in extracted_data}

    # Recursively loop through the input folder
    for root, _, files in os.walk(input_folder):
        for file in files:
            if file.endswith(".json"):
                file_path = os.path.join(root, file)

                # Read each trophy file
                with open(file_path, "r") as f:
                    trophy_data = json.load(f)

                # Get the trophy id from the file and match it with the extracted data
                trophy_id = trophy_data.get("id")
                if trophy_id and trophy_id in extracted_dict:
                    trophy_data["code"] = extracted_dict[trophy_id]
                else:
                    trophy_data["code"] = None  # Set to None if no match is found

                # Write the updated trophy data back to the file
                with open(file_path, "w") as f:
                    json.dump(trophy_data, f, indent=2)
                print(f"Updated file: {file_path}")


# Run the function
if __name__ == "__main__":
    add_trophy_code_to_files()
    print("Trophy files updated with codes.")
