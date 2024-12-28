import json

# Load the previous JSON file
with open("out/trophies_scores.json", "r") as f:
    trophies = json.load(f)

# Define boss trophies
boss_trophies = [
    "Eikthyr trophy",
    "The Elder trophy",
    "Bonemass trophy",
    "Moder trophy",
    "Yagluth trophy",
    "The Queen trophy",
    "Fader trophy",
]

# Assign scores based on the boss first and then the biome
for trophy in trophies:
    if trophy["biome"] == "Ocean":
        trophy["group"] = "Ocean/Penalty"
    else:
        trophy["group"] = trophy["biome"]

# Add 3 death penalty trophies
for i in range(3):
    trophies.append(
        {
            "id": f"death{i + 1}",
            "biome": "Penalty",
            "image": "./death.webp",
            "name": "Death #" + str(i + 1),
            "dropChance": "",
            "group": "Ocean/Penalty",
            "score": -20,
        }
    )

# Add 3 re-log penalty trophies
for i in range(3):
    trophies.append(
        {
            "id": f"relog{i + 1}",
            "biome": "Penalty",
            "image": "./logout.webp",
            "name": "Relog #" + str(i + 1),
            "dropChance": "",
            "group": "Ocean/Penalty",
            "score": -10,
        }
    )

# Save to new JSON file
with open("out/trophies.json", "w") as f:
    json.dump(trophies, f, indent=4)

print(f"Trophies file is now ready to use in trophies.json")
print(f"Next steps:")
print(f"Download the trophy images using the trophy_step4_download_images.py")
