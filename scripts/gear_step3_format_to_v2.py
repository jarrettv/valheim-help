import json


def convert_item(item):
    new_item = {
        "id": item["id"],
        "code": item["code"],
        "name": item["name"],
        "desc": item["description"],
        "type": item["type"],
        "image": item["iconUrl"],
        "usage": item.get("usage", "Weapon"),
        "wield": item.get("wielding", "Unknown"),
        "weight": item.get("weight", 0),
        "power": item["power"],
        "source": item["source"],
        "durab": ">".join(
            str(level.get("durability", "0")) for level in item.get("levels", [])
        ),
        "craft": ">".join(
            str(level.get("craftingLevel", "0")) for level in item.get("levels", [])
        ),
        "repair": ">".join(
            str(level.get("repairLevel", "0")) for level in item.get("levels", [])
        ),
    }

    if new_item["wield"] == "Unknown":
        if item["id"] == "mistwalker":
            new_item["wield"] = "One-handed"
        elif item["id"] == "slayer":
            new_item["wield"] = "Two-handed"
        elif item["id"] == "dyrnwyn":
            new_item["wield"] = "One-handed"
        elif item["id"] == "torch":
            new_item["wield"] = "Off-hand"
        elif item["id"] == "crystal_battleaxe":
            new_item["wield"] = "Two-handed"
        elif item["id"] == "jotun_bane":
            new_item["wield"] = "One-handed"
        elif item["id"] == "himminafl":
            new_item["wield"] = "Two-handed"
        elif item["id"] == "spinesnap":
            new_item["wield"] = "Two-handed"
        elif item["id"] == "draugr_fang":
            new_item["wield"] = "Two-handed"
        elif item["id"] == "dead_raiser":
            new_item["wield"] = "Two-handed"
        elif item["id"] == "staff_of_embers":
            new_item["wield"] = "Two-handed"
        elif item["id"] == "staff_of_frost":
            new_item["wield"] = "Two-handed"

    new_item["mats"] = {}
    for key in item["levels"][0].get("materials", {}).keys():
        new_item["mats"][key] = ">".join(
            str(level["materials"].get(key, "0")) for level in item["levels"]
        )

    if "passive" in item:
        new_item["passive"] = {}
        for key, value in item["passive"].items():
            if isinstance(value, str):
                value = value.rstrip("%")
                try:
                    new_item["passive"][key] = int(value)
                except ValueError:
                    try:
                        new_item["passive"][key] = float(value)
                    except ValueError:
                        new_item["passive"][key] = value
            else:
                new_item["passive"][key] = value

    if item["levels"][0].get("primaryAttack"):
        new_item["attack"] = {}
        for key in item["levels"][0].get("primaryAttack").keys():
            if key in ["Knockback", "Backstab", "Stamina", "Attack speed"]:
                primary_values = str(
                    item["levels"][0].get("primaryAttack", {}).get(key, "")
                )
            else:
                primary_values = ">".join(
                    str(level.get("primaryAttack", {}).get(key, ""))
                    for level in item["levels"]
                )
            secondary_values = ""
            if item["levels"][0].get("secondaryAttack"):
                if key in ["Knockback", "Backstab", "Stamina", "Attack speed"]:
                    secondary_values = str(
                        item["levels"][0].get("secondaryAttack", {}).get(key, "")
                    )
                else:
                    secondary_values = ">".join(
                        str(level.get("secondaryAttack", {}).get(key, ""))
                        for level in item["levels"]
                    )

            if primary_values.strip() and secondary_values.strip():
                new_item["attack"][key] = f"{primary_values};{secondary_values}"
            elif primary_values.strip():
                new_item["attack"][key] = primary_values

        # remove Backstab, Stamina, and Stagger from attack and put them at the end
        backstab = new_item["attack"].pop("Backstab", "")
        stamina = new_item["attack"].pop("Stamina", "")
        stagger = new_item["attack"].pop("Stagger", "")
        if stamina != "":
            new_item["attack"]["Stamina"] = stamina

        if stagger != "":
            new_item["attack"]["Stagger"] = stagger

        if backstab != "":
            new_item["attack"]["Backstab"] = backstab

    # Dynamically copy block section
    if item["levels"][0].get("blocking"):
        new_item["block"] = {}
        block_keys = item["levels"][0]["blocking"].keys()
        for key in block_keys:
            if key == "Parry bonus":
                new_item["block"]["Parry bonus"] = item["levels"][0]["blocking"][
                    "Parry bonus"
                ]
            else:
                new_item["block"][key] = ">".join(
                    level["blocking"][key].replace(";", ">") for level in item["levels"]
                )

    return new_item


def convert_items(input_file, output_file):
    with open(input_file, "r") as f:
        items = json.load(f)

    converted_items = [convert_item(item) for item in items]

    with open(output_file, "w") as f:
        json.dump(converted_items, f, indent=2)


# Usage
input_file = "out/weapons_v1.json"
output_file = "out/weapons.json"
convert_items(input_file, output_file)
