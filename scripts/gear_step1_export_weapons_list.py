import os
import requests
from bs4 import BeautifulSoup
import json

os.makedirs("out", exist_ok=True)

# Define the base URL of the wiki
url = "https://valheim.fandom.com/wiki/Weapons"
weapons = []  # List of weapons, you can expand this list or scrape it dynamically

# remove unwanted weapons Iron_shield, Knight_shield, Flametal_tower_shield
unwanted_weapons = ["Iron_shield", "Knight_shield", "Flametal_tower_shield"]

fileName = "out/weapons.html"

if not os.path.exists(fileName):
    print(f"Downloading {url}...")
    response = requests.get(url)
    with open(fileName, "wb") as file:
        file.write(response.content)

print(f"Reading {fileName}...")
with open(fileName, "rb") as file:
    data = file.read()

    soup = BeautifulSoup(data, "html.parser")
    weapon_tables = soup.find_all("table", {"class": "sortable"})
    for weapon_table in weapon_tables:
        for row in weapon_table.find("tbody").find_all("tr"):
            cell = row.find("td")
            if not cell:
                continue
            weapon = cell.find("a")
            # if weapon isn't NoneType
            if weapon and weapon["href"].startswith("/wiki/"):
                wiki_name = weapon["href"].replace("/wiki/", "")
                # make canonical name
                words = wiki_name.lower().split("_")
                words[0] = words[0].capitalize()
                weapon_name = "_".join(words)
                if weapon_name == "Nidh%c3%b6gg":
                    weapon_name = "Nidhogg"

                # if in unwanted weapons, skip
                if weapon_name in unwanted_weapons:
                    print(f"Unwanted ⛔ {weapon_name}")
                    continue

                # add to list if not already present
                if any(weapon["weapon_name"] == weapon_name for weapon in weapons):
                    print(f"Duplicate ⚠️ {weapon_name}")
                else:
                    print(wiki_name + " ➡️ " + weapon_name)
                    weapons.append({"wiki_name": wiki_name, "weapon_name": weapon_name})

# order alphabetically
weapons.sort(key=lambda x: x["weapon_name"])

# Write the weapon names to a file
with open("out/weapons.txt", "w") as file:
    for i, weapon in enumerate(weapons):
        file.write(f"{weapon['wiki_name']}={weapon['weapon_name']}")
        if i < len(weapons) - 1:  # Only add a newline if this isn't the last line
            file.write("\n")

print(f"Writing {len(weapons)} weapons to out/weapons.txt")
