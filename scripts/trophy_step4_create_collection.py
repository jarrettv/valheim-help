import os
import json

import requests

# Ensure the output directory exists
output_dir = "out/trophy"
os.makedirs(output_dir, exist_ok=True)

# Load the trophies data from the JSON file
with open("out/trophies.json", "r") as f:
    trophies = json.load(f)

skip = []
download = []
not_found = trophies.copy()

# Iterate over each trophy and write it to an individual file
for trophy in trophies:
    trophy_id = trophy["id"]
    trophy_group = trophy["biome"].lower().replace(" ", "_")

    img_url = trophy.pop("iconUrl", "")
    trophy.pop("droppedBy", "")
    trophy.pop("droppedByUrl", "")
    trophy.pop("uses", "")
    trophy.pop("url", "")

    group_dir = os.path.join(output_dir, trophy_group)
    os.makedirs(group_dir, exist_ok=True)
    output_file_path = os.path.join(group_dir, f"{trophy_id}.json")

    with open(output_file_path, "w") as output_file:
        json.dump(trophy, output_file, indent=4)

    print(img_url)
    if img_url == "":
        print(f"⛔ {trophy['name']}")
        continue

    trophy["image"] = f"./{trophy_id}.png"

    img_filename = os.path.join(group_dir, f"{trophy_id}.png")
    if not os.path.exists(img_filename):
        img_response = requests.get(img_url)

        if img_response.status_code != 200:
            print(f"⛔ {trophy['name']}")
            continue

        with open(img_filename, "wb") as img_file:
            img_file.write(img_response.content)
        download.append(trophy)
        print(f"✅ {trophy['name']}")
        not_found.remove(trophy)
    else:
        skip.append(trophy)
        print(f"➡️ {trophy['name']}")

print("trophy files have been created successfully.")
