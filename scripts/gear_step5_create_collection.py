import os
import json

import requests

# Ensure the output directory exists
output_dir = "out/gear"
os.makedirs(output_dir, exist_ok=True)

# Load the weapons data from the JSON file
with open("out/weapons.json", "r") as f:
    weapons = json.load(f)

skip = []
download = []
not_found = weapons.copy()

# Iterate over each weapon and write it to an individual file
for weapon in weapons:
    weapon_id = weapon["id"]
    weapon_group = (
        weapon["type"].lower().replace("elemental ", "").replace("blood ", "")
    )
    if weapon_group in ["arrow", "bolt", "missile", "bomb"]:
        weapon_group = "projectile"

    if weapon_group == "axes":
        weapon_group = "axe"
        weapon["type"] = "Axe"

    img_url = weapon.pop("iconUrl", "")

    group_dir = os.path.join(output_dir, weapon_group)
    os.makedirs(group_dir, exist_ok=True)
    output_file_path = os.path.join(group_dir, f"{weapon_id}.json")

    with open(output_file_path, "w") as output_file:
        json.dump(weapon, output_file, indent=4)

    if img_url == "":
        print(f"⛔ {weapon['name']}")
        continue

    img_filename = os.path.join(group_dir, f"{weapon_id}.png")
    if not os.path.exists(img_filename):
        img_response = requests.get(img_url)

        if img_response.status_code != 200:
            print(f"⛔ {weapon['name']}")
            continue

        with open(img_filename, "wb") as img_file:
            img_file.write(img_response.content)
        download.append(weapon)
        print(f"✅ {weapon['name']}")
        not_found.remove(weapon)
    else:
        skip.append(weapon)
        print(f"➡️ {weapon['name']}")

print("Weapon files have been created successfully.")
