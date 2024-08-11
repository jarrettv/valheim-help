import json
from collections import defaultdict

# File paths
input_file = "out/weapons_v1.json"
output_file = "out/material_counts.txt"

# Initialize a dictionary to keep count of materials
material_counts = defaultdict(int)

# Read the JSON data from the file
with open(input_file, "r") as f:
    data = json.load(f)

# Iterate through the items in the JSON data
for item in data:
    for level in item.get("levels", []):
        materials = level.get("materials", {})
        for material, count in materials.items():
            material_counts[material] += count

# Write the material counts to the output file
with open(output_file, "w") as f:
    for material, count in material_counts.items():
        f.write(f"{material}={count}\n")

print(f"Material counts have been written to {output_file}")
