import os
import json
import BeautifulSoup
import requests

os.makedirs("out", exist_ok=True)

# URL of the Valheim wiki page with trophies
url = "https://valheim.fandom.com/wiki/Trophies"

fileName = "out/trophies.html"

if not os.path.exists(fileName):
    print(f"Downloading {url}...")
    response = requests.get(url)
    if response.status_code == 200:
        with open(fileName, "wb") as file:
            file.write(response.content)
    else:
        print(f"Failed to download {url}. Status code: {response.status_code}")
        exit(-1)

print(f"Reading {fileName}...")
with open(fileName, "rb") as file:
    data = file.read()

    soup = BeautifulSoup(data, "html.parser")

    trophies = []
    current_biome = None

    # Find the #List_of_trophies element and start parsing from there
    start_element = soup.find(id="List_of_trophies")
    if start_element:
        for headline in start_element.find_all_next(["h2", "h3"]):
            if headline.name == "h3":
                current_biome = headline.find_next("span").text.strip()
            elif headline.name == "h2" and "List of trophies" in headline.text:
                continue

            table = headline.find_next("table")
            if table:
                rows = table.find("tbody").find_all("tr")[1:]
                for row in rows:
                    cols = row.find_all("td")
                    if len(cols) != 5:
                        continue
                    icon_col, name_col, dropped_by_col, drop_chance_col, uses_col = cols

                    name_tag = name_col.find("a")
                    name = name_tag.text.strip()
                    name_url = name_tag["href"]
                    dropped_by_tag = dropped_by_col.find("a")
                    dropped_by = dropped_by_tag.text.strip()
                    dropped_by_url = dropped_by_tag["href"]
                    drop_chance = drop_chance_col.text.strip()
                    uses = uses_col.text.strip()
                    icon_url = icon_col.find("a")["href"]
                    if icon_url.startswith("data:image"):
                        icon_url = icon_col.find("a")["data-src"]

                    trophies.append(
                        {
                            "id": name.replace(" ", "_").lower(),
                            "biome": current_biome,
                            "iconUrl": icon_url,
                            "name": name.replace(" trophy", ""),
                            "url": f"https://valheim.fandom.com{name_url}",
                            "droppedBy": dropped_by,
                            "droppedByUrl": f"https://valheim.fandom.com{dropped_by_url}",
                            "dropChance": drop_chance,
                            "uses": uses,
                        }
                    )

    # Save to JSON file
    with open("out/trophies_raw.json", "w") as f:
        json.dump(trophies, f, indent=4)

    print("Trophies successfully exported to trophies_raw.json.")
    print(f"Next step:")
    print(f"Add scores to the trophies using the trophy_step2_add_scores.py")
