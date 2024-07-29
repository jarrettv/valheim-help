import json

# Load the previous JSON file
with open('valheim_trophies.json', 'r') as f:
    trophies = json.load(f)

# Define boss trophies
boss_trophies = ["Eikthyr trophy", "The Elder trophy", "Bonemass trophy", "Moder trophy", "Yagluth trophy", "The Queen trophy", "Fader trophy"]

# Assign scores based on the boss first and then the biome
for trophy in trophies:
    name = trophy['name']
    biome = trophy['biome']

    if name in boss_trophies:
        trophy['score'] = 50
    elif biome == "Meadows":
        trophy['score'] = 10
    elif biome in ["Black Forest", "Swamp"]:
        trophy['score'] = 20
    elif biome in ["Mountain", "Plains"]:
        trophy['score'] = 30
    elif biome == "Mistlands":
        trophy['score'] = 40
    elif biome == "Ashlands":
        trophy['score'] = 50
    elif biome == "Ocean" and name == "Serpent trophy":
        trophy['score'] = 25
    else:
        trophy['score'] = 0  # Default score if not matched

# Save to new JSON file
with open('valheim_trophies_with_scores.json', 'w') as f:
    json.dump(trophies, f, indent=4)

print("Trophies with scores successfully exported to valheim_trophies_with_scores.json")
