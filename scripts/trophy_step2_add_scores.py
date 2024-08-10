import json

# Load the previous JSON file
with open("out/trophies_raw.json", "r") as f:
    trophies = json.load(f)

# Assign scores based on the boss first and then the biome
for trophy in trophies:
    name = trophy["name"]
    biome = trophy["biome"]

    if name in ["Eikthyr", "The Elder"]:
        trophy["score"] = 50
    elif name in ["Bonemass"]:
        trophy["score"] = 80
    elif name in ["Moder", "Yagluth"]:
        trophy["score"] = 100
    elif name in ["The Queen", "Fader"]:
        trophy["score"] = 1000
    elif biome == "Meadows":
        trophy["score"] = 10
    elif biome in ["Black Forest", "Swamp"]:
        trophy["score"] = 20
    elif biome in ["Mountain", "Plains"]:
        trophy["score"] = 30
    elif biome == "Mistlands":
        trophy["score"] = 40
    elif biome == "Ashlands":
        trophy["score"] = 50
    elif biome == "Ocean" and name == "Serpent":
        trophy["score"] = 25
    else:
        trophy["score"] = 0  # Default score if not matched

# Save to new JSON file
with open("out/trophies_scores.json", "w") as f:
    json.dump(trophies, f, indent=4)

print(f"Trophies with scores successfully exported to trophies_scores.json")
print(f"Next steps:")
print(
    f"Add groups and penalty to the trophies using the trophy_step3_add_groups_and_penalty.py"
)
