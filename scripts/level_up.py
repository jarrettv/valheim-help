import json


def parse_value(value):
    if isinstance(value, str):
        try:
            if " " in value:
                return float(value.split()[0])
            return float(value)
        except ValueError:
            return value
    return value


def calculate_differences(levels):
    differences = []
    for i in range(1, len(levels)):
        prev_level = levels[i - 1]
        curr_level = levels[i]
        diff = {"level": curr_level["level"]}

        for key, value in curr_level.items():
            if key == "level":
                continue
            if isinstance(value, dict):
                diff[key] = {}
                for sub_key, sub_value in value.items():
                    prev_value = prev_level[key].get(sub_key, None)
                    sub_value_parsed = parse_value(sub_value)
                    prev_value_parsed = parse_value(prev_value)
                    if isinstance(sub_value_parsed, (int, float)) and isinstance(
                        prev_value_parsed, (int, float)
                    ):
                        diff[key][sub_key] = sub_value_parsed - prev_value_parsed
                    else:
                        diff[key][sub_key] = sub_value
            else:
                prev_value = prev_level.get(key, None)
                value_parsed = parse_value(value)
                prev_value_parsed = parse_value(prev_value)
                if isinstance(value_parsed, (int, float)) and isinstance(
                    prev_value_parsed, (int, float)
                ):
                    diff[key] = value_parsed - prev_value_parsed
                else:
                    diff[key] = value
        differences.append(diff)
    return differences


def main():
    with open("out/weapons.json", "r") as file:
        weapons = json.load(file)

    levelup_data = []
    for weapon in weapons:
        if "levels" in weapon:
            differences = calculate_differences(weapon["levels"])
            levelup_data.append(
                {"name": weapon["name"], "id": weapon["id"], "differences": differences}
            )

    with open("out/levelup.json", "w") as file:
        json.dump(levelup_data, file, indent=4)


if __name__ == "__main__":
    main()
