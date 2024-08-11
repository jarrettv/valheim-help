import os
import json
import requests

# File paths
input_file = "out/materials_v1.json"
output_folder = "out/mats_img/"

# Ensure the output directory exists
os.makedirs(output_folder, exist_ok=True)

# Read the JSON data from the file
with open(input_file, "r") as f:
    materials = json.load(f)

# Download the images if they do not already exist
for material in materials:
    image_url = material.get("iconUrl")
    image_name = os.path.basename(material.get("image"))
    image_path = os.path.join(output_folder, image_name)

    # Check if the image already exists
    if not os.path.exists(image_path):
        try:
            # Download the image
            response = requests.get(image_url)
            response.raise_for_status()  # Check for request errors

            # Write the image to the output folder
            with open(image_path, "wb") as img_file:
                img_file.write(response.content)

            print(f"Downloaded: {image_name}")
        except requests.exceptions.RequestException as e:
            print(f"Failed to download {image_name}: {e}")
    else:
        print(f"Image already exists: {image_name}")

print("Image download process completed.")
