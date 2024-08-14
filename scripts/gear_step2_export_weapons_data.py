import os
import requests
from bs4 import BeautifulSoup
import json

os.makedirs("out/weapon_html", exist_ok=True)

base_url = "https://valheim.fandom.com/wiki/"

# load list of weapons into pairs of wiki name and canonical name from out/weapons.txt
list_file = "out/weapons.txt"
weapons = []
with open(list_file, "r") as file:
    for line in file:
        wiki_name, weapon_name = line.strip().split("=")
        weapons.append({"wiki_name": wiki_name, "weapon_name": weapon_name})

data = []
types = {}


def get_attack_info(attk_tag, tab):
    attk = {}
    attk_sections = attk_tag.parent.find_all("section")
    for attk_section in attk_sections:
        if attk_section:
            atts = attk_section.find_all("th")
            vals = attk_section.find_all("td")
            for i, att in enumerate(atts):
                # if att.text == "Attack speed" or vals[i].text == "Attack speed":
                #     continue
                if vals[i].text.isdigit():
                    attk[att.text] = int(vals[i].text)
                else:
                    attk[att.text] = vals[i].text

    if "Stamina" not in attk:
        stam_tag = tab.find("h3", string="Stamina")
        if stam_tag:
            atts = stam_tag.parent.parent.find_all("h3")
            vals = stam_tag.parent.parent.find_all("div")
            for i, att in enumerate(atts):
                if vals[i].text.isdigit():
                    attk[att.text] = int(vals[i].text)
                else:
                    attk[att.text] = vals[i].text

    # chain_tag = attk_tag.find("h3", string="Chain last hit")
    # if chain_tag:
    #     attk["Chain last hit"] = chain_tag.find_next("div").text.strip()

    # hitbox_tag = attk_tag.find("h3", string="Hitbox")
    # if hitbox_tag:
    #     attk["Hitbox"] = hitbox_tag.find_next("div").text.strip()

    return attk


def add_info_from_table(table, attribute):
    power = 0
    atts = table.find_all("th")
    vals = table.find_all("td")

    for i, att in enumerate(atts):
        print(f"{att.text}={vals[i].text}")
        attribute[att.text] = (
            vals[i].text.replace(" (0 skill)", "-").replace(" (100 skill)", "")
        )
        if " (0 skill)" in vals[i].text:
            zero_score = vals[i].text.split(" (0 skill)")[0]
            if zero_score.isdigit():
                power += int(zero_score)
    return power


def get_blocking_info(tab, blocking_table_tag):
    blocking = {}
    power = add_info_from_table(blocking_table_tag, blocking)

    parry_tag = tab.find("th", string="Parry bonus")
    if parry_tag:
        power += add_info_from_table(parry_tag.parent.parent.parent, blocking)

    force_tag = tab.find("th", string="Block force")
    if force_tag:
        power += add_info_from_table(force_tag.parent.parent.parent, blocking)

    return (blocking, power)


def get_weapon_info(wiki_name, weapon_name):
    url = base_url + wiki_name
    html_filename = "./out/weapon_html/" + weapon_name + ".html"

    if not os.path.exists(html_filename):
        print(f"Downloading {url}...")
        response = requests.get(url)
        with open(html_filename, "wb") as f:
            f.write(response.content)

    print(f"Reading {html_filename}...")
    with open(html_filename, "rb") as file:
        html = file.read()
        soup = BeautifulSoup(html, "html.parser")

        item = {}
        item["id"] = weapon_name.replace(" ", "_").lower()
        item["name"] = soup.find("meta", property="og:title")["content"]

        # Extract description
        description_tag = soup.find("div", {"data-source": "description"})
        item["description"] = description_tag.find("i").text if description_tag else ""

        # Extract image
        item["iconUrl"] = ""
        figure_tag = soup.find("figure", {"class": "pi-item pi-image"})
        if figure_tag:
            image_tag = figure_tag.find("img")
            if image_tag:
                item["iconUrl"] = image_tag["src"]

        # Extract internal ID
        internal_id_tag = soup.find("div", {"data-source": "id"})
        if internal_id_tag:
            item["code"] = internal_id_tag.find(
                "div", {"class": "pi-data-value pi-font"}
            ).text
        else:
            item["code"] = weapon_name.replace(" ", "_").lower()

        # Extract type
        type_tag = soup.find("h3", string="Type").parent.find("a")
        if type_tag:
            item["type"] = type_tag.string
        elif weapon_name in ["Arbalest", "Ripper"]:
            item["type"] = "Crossbow"
        elif weapon_name.endswith("bolt"):
            item["type"] = "Bolt"
        elif weapon_name.endswith("bomb"):
            item["type"] = "Bomb"
        else:
            item["type"] = "Other"

        if item["type"] not in types:
            types[item["type"]] = 1
        else:
            types[item["type"]] += 1

        # Extract source
        source_tag = soup.find("h3", string="Source").parent.find("a")
        item["source"] = source_tag.string if source_tag else ""

        # Extract usage
        usage_tag = soup.find("h3", string="Usage")
        if usage_tag:
            item["usage"] = (
                usage_tag.parent.find("div").text
                if usage_tag.parent.find("div")
                else ""
            )

        passive_tag = soup.find("h2", string="Passive")
        if passive_tag:
            item["passive"] = {}
            item["passive"][passive_tag.parent.find("h3").text.strip()] = (
                passive_tag.parent.find("div", class_="pi-data-value").text.strip()
            )

        item["power"] = 0

        # Extract levels
        levels = []
        tabs = soup.find_all("div", class_="wds-tab__content")
        for index, tab in enumerate(tabs):
            level_info = {"level": index + 1}

            # Wielding never changes per level
            wielding_tag = tab.find("h3", string="Wielding")
            if wielding_tag:
                item["wielding"] = wielding_tag.find_next("div").text.strip()

            # Extract weight and durability
            weight_durability_table = tab.find("th", string="Durability")
            if weight_durability_table:
                weight_durability_rows = (
                    weight_durability_table.parent.parent.parent.find_all("td")
                )

                # Weight never changes per level
                item["weight"] = (
                    float(weight_durability_rows[0].text.strip())
                    if len(weight_durability_rows) > 0
                    else 0
                )
                level_info["durability"] = (
                    int(weight_durability_rows[1].text.strip())
                    if len(weight_durability_rows) > 1
                    else 0
                )

            # Extract crafting level and repair level
            craft_repair_table = tab.find("th", string="Crafting Level")
            if craft_repair_table:
                crafting_repair_rows = craft_repair_table.parent.parent.parent.find_all(
                    "td"
                )
                level_info["craftingLevel"] = (
                    int(crafting_repair_rows[0].text.strip())
                    if crafting_repair_rows[0].text.strip() != "nil"
                    and len(crafting_repair_rows) > 0
                    else 0
                )
                level_info["repairLevel"] = (
                    int(crafting_repair_rows[1].text.strip())
                    if len(crafting_repair_rows) > 1
                    else 0
                )

            # Extract crafting materials
            materials = {}
            materials_tag = tab.find("h3", string="Crafting Materials")
            if materials_tag:
                for li in materials_tag.find_next("div").find_all("li"):
                    if li.find("a"):
                        material = li.find("a").text
                        # remove the ' x' from the quantity
                        if li.contents[0].text[0].isdigit():
                            quantity = li.contents[0].replace("x", "").strip()
                        else:
                            quantity = li.contents[1].replace("x", "").strip()
                        materials[material] = int(quantity)
                    else:
                        material, quantity = li.text.split(" x")
                        materials[material.strip()] = int(quantity)
            level_info["materials"] = materials

            # Extract primary and secondary attack if they exist
            primary_attack_tag = tab.find("h2", string="Primary attack")
            if primary_attack_tag:
                level_info["primaryAttack"] = get_attack_info(primary_attack_tag, tab)

            primary_attack_tag = tab.find("h2", string="Secondary attack")
            if primary_attack_tag:
                level_info["secondaryAttack"] = get_attack_info(primary_attack_tag, tab)

            # Extract block if it exists
            blocking_tag = tab.find("div", string="Blocking")
            if blocking_tag:
                blocking, b_power = get_blocking_info(tab, blocking_tag.parent.parent)
                level_info["blocking"] = blocking
                if b_power > item["power"]:
                    item["power"] = b_power

            levels.append(level_info)

        item["levels"] = levels

    return item


for weapon in weapons:
    data.append(get_weapon_info(weapon["wiki_name"], weapon["weapon_name"]))

with open("out/weapons_v1.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=4)

print("Data extraction completed.")

print("Types:", types)
