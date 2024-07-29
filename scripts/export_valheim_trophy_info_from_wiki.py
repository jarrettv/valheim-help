import json
from bs4 import BeautifulSoup
import requests

# URL of the Valheim wiki page with trophies
url = "https://valheim.fandom.com/wiki/Trophies"

# Send a GET request to fetch the page content
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    html_content = response.content
    soup = BeautifulSoup(html_content, 'html.parser')

    trophies = []
    current_biome = None

    # Find the #List_of_trophies element and start parsing from there
    start_element = soup.find(id="List_of_trophies")
    if start_element:
        for headline in start_element.find_all_next(['h2', 'h3']):
            if headline.name == 'h3':
                current_biome = headline.find_next('span').text.strip()
            elif headline.name == 'h2' and 'List of trophies' in headline.text:
                continue

            table = headline.find_next('table')
            if table:
                rows = table.find('tbody').find_all('tr')[1:]
                for row in rows:
                    cols = row.find_all('td')
                    if len(cols) != 5:
                        continue
                    icon_col, name_col, dropped_by_col, drop_chance_col, uses_col = cols

                    name_tag = name_col.find('a')
                    name = name_tag.text.strip()
                    name_url = name_tag['href']
                    dropped_by_tag = dropped_by_col.find('a')
                    dropped_by = dropped_by_tag.text.strip()
                    dropped_by_url = dropped_by_tag['href']
                    drop_chance = drop_chance_col.text.strip()
                    uses = uses_col.text.strip()

                    img_filename = f'trophies/{name.replace(" ", "_").lower()}.png'

                    trophies.append({
                        'biome': current_biome,
                        'iconUrl': img_filename,
                        'name': name,
                        'url': f"https://valheim.fandom.com{name_url}",
                        'droppedBy': dropped_by,
                        'droppedByUrl': f"https://valheim.fandom.com{dropped_by_url}",
                        'dropChance': drop_chance,
                        'uses': uses
                    })

    # Save to JSON file
    with open('valheim_trophies.json', 'w') as f:
        json.dump(trophies, f, indent=4)

    print("Trophies successfully exported to valheim_trophies.json.")
else:
    print(f"Failed to fetch the page. Status code: {response.status_code}")
