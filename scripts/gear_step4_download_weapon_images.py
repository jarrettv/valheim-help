import requests
import os
from bs4 import BeautifulSoup

url = "https://valheim.fandom.com/wiki/Weapons"
response = requests.get(url)

os.makedirs("out/weapon_img", exist_ok=True)

# load list of weapons into pairs of wiki name and canonical name from out/weapons.txt
list_file = "out/weapons.txt"
weapons = []
with open(list_file, "r") as file:
    for line in file:
        wiki_name, weapon_name = line.strip().split("=")
        weapons.append({"wiki_name": wiki_name, "weapon_name": weapon_name})

# Check if the request was successful
if response.status_code == 200:
    html_content = response.content
    soup = BeautifulSoup(html_content, "html.parser")

    skip = []
    download = []
    not_found = weapons.copy()

    for weapon in weapons:
        weapon_links = soup.find_all("a", {"href": "/wiki/" + weapon["wiki_name"]})
        for weapon_link in weapon_links:
            if weapon_link.parent.name != "td":
                continue
            weapon_row = weapon_link.parent.parent
            img = weapon_row.find("img")
            if img["src"].startswith("data:"):
                img_url = img["data-src"]
            else:
                img_url = img["src"]
            # print(weapon, img_url)
            img_filename = f"out/weapon_img/{weapon['weapon_name']}.png"
            if not os.path.exists(img_filename):
                img_response = requests.get(img_url)
                with open(img_filename, "wb") as img_file:
                    img_file.write(img_response.content)
                download.append(weapon)
                print(f"✅ {weapon['weapon_name']}")
                not_found.remove(weapon)
                break
            else:
                skip.append(weapon)
                print(f"➡️ {weapon}")
                not_found.remove(weapon)
                break
        if weapon in not_found:
            print(f"⛔ {weapon}")

    print(" ========== DONE ========== ")
    # print count skip and not found
    print(f"Downloaded ✅ {len(download)}")
    print(f"   Skipped ➡️ {len(skip)}")
    print(f" Not Found ⛔ {len(not_found)}")

else:
    print(f"Failed to fetch the page. Status code: {response.status_code}")
