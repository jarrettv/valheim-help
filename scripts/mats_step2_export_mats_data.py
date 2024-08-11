import os
import requests
from bs4 import BeautifulSoup
import json

os.makedirs("out/mat_html", exist_ok=True)

base_url = "https://valheim.fandom.com/wiki/"

list_file = "out/material_counts.txt"
mats = []
with open(list_file, "r") as file:
    for line in file:
        wiki_name, count = line.strip().split("=")
        mats.append({"wiki_name": wiki_name, "count": count})

data = []
types = {}


def add_info_from_table(table, attribute):
    atts = table.find_all("th")
    vals = table.find_all("td")

    for i, att in enumerate(atts):
        print(f"{att.text}={vals[i].text}")
        attribute[att.text.lower()] = vals[i].text


def get_material_info(wiki_name):
    material_name = wiki_name.replace("_", " ")
    url = base_url + wiki_name
    html_filename = "./out/mat_html/" + material_name + ".html"

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
        id = material_name.replace(" ", "_").replace("_(item)", "").lower()
        item["id"] = id
        item["image"] = f"mats/{id}.png"
        item["name"] = soup.find("meta", property="og:title")["content"]

        # Extract description
        description_tag = soup.find("div", {"data-source": "description"})
        item["desc"] = description_tag.find("i").text if description_tag else ""

        # Extract image
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
            item["code"] = material_name.replace(" ", "_").lower()

        # Extract type
        type_tag = soup.find("h3", string="Type").parent.find("div")
        if type_tag:
            item["type"] = type_tag.string
        else:
            item["type"] = "Unknown"

        if item["type"] not in types:
            types[item["type"]] = 1
        else:
            types[item["type"]] += 1

        # Extract dropped by
        dropped_by_tag = soup.find("h3", string="Dropped by")
        if dropped_by_tag:
            source_tag = dropped_by_tag.parent.find("a")
            item["drop"] = source_tag.string if source_tag else ""

        # Extract usage
        usage_tag = soup.find("h3", string="Usage")
        if usage_tag:
            item["usage"] = (
                usage_tag.parent.find("div").text
                if usage_tag.parent.find("div")
                else ""
            )

        # Extract weight and stack size
        weight_tag = soup.find("th", string="Weight")
        if weight_tag:
            add_info_from_table(weight_tag.parent.parent.parent, item)

        stack_tag = soup.find("th", string="Stack")
        if stack_tag:
            add_info_from_table(stack_tag.parent.parent.parent, item)

        # Extract crafting materials
        materials = {}
        materials_tag = soup.find("h3", string="Crafting Materials")
        if materials_tag:
            for li in materials_tag.find_next("div").find_all("li"):
                if li.find("a"):
                    mat = li.find("a").text
                    # remove the ' x' from the quantity
                    if li.contents[0].text[0].isdigit():
                        quantity = li.contents[0].replace("x", "").strip()
                    else:
                        quantity = li.contents[1].replace("x", "").strip()
                    materials[mat] = int(quantity)
                else:
                    mat, quantity = li.text.split(" x")
                    materials[mat.strip()] = int(quantity)
        item["mats"] = materials

    return item


for material in mats:
    if material["wiki_name"].endswith("fragment"):
        print(f"Skipping {material['wiki_name']}...")
        continue

    data.append(get_material_info(material["wiki_name"]))

with open("out/materials_v1.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=4)

print("Data extraction completed.")

print("Types:", types)
