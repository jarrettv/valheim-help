import os
import json

import requests

# Ensure the output directory exists
output_dir = "out/mats"
os.makedirs(output_dir, exist_ok=True)

# Load the materials data from the JSON file
with open("out/materials_v1.json", "r") as f:
    materials = json.load(f)

skip = []
download = []
not_found = materials.copy()

# Iterate over each material and write it to an individual file
for material in materials:
    material_id = material["id"]
    material_group = material["type"].lower()

    img_url = material.pop("iconUrl", "")

    material["image"] = f"./{material_id}.png"

    material["weight"] = float(material["weight"]) if "weight" in material else 0
    material["stack"] = int(material["stack"]) if "stack" in material else 0

    group_dir = os.path.join(output_dir, material_group)
    os.makedirs(group_dir, exist_ok=True)
    output_file_path = os.path.join(group_dir, f"{material_id}.json")

    with open(output_file_path, "w") as output_file:
        json.dump(material, output_file, indent=4)

    if img_url == "":
        print(f"⛔ {material['name']}")
        continue

    img_filename = os.path.join(group_dir, f"{material_id}.png")
    if not os.path.exists(img_filename):
        img_response = requests.get(img_url)

        if img_response.status_code != 200:
            print(f"⛔ {material['name']}")
            continue

        with open(img_filename, "wb") as img_file:
            img_file.write(img_response.content)
        download.append(material)
        print(f"✅ {material['name']}")
        not_found.remove(material)
    else:
        skip.append(material)
        print(f"➡️ {material['name']}")

print("Material files have been created successfully.")
