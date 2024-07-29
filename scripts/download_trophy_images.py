import requests
import os
from bs4 import BeautifulSoup

# URL of the Valheim wiki page with trophies
url = "https://valheim.fandom.com/wiki/Trophies"

# Send a GET request to fetch the page content
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    html_content = response.content
    soup = BeautifulSoup(html_content, 'html.parser')

    # Create a directory to save trophy images if it doesn't exist
    os.makedirs('trophies', exist_ok=True)

    # Find the #List_of_trophies element and start parsing from there
    start_element = soup.find(id="List_of_trophies")
    if start_element:
        for headline in start_element.find_all_next(['h2', 'h3']):
            if headline.name == 'h3':
                current_biome = headline.text.strip()
            elif headline.name == 'h2' and 'List of trophies' in headline.text:
                continue

            table = headline.find_next('table')
            if table:
                rows = table.find('tbody').find_all('tr')[1:]
                for row in rows:
                    cols = row.find_all('td')
                    if len(cols) != 5:
                        continue
                    icon_col = cols[0]
                    name_col = cols[1]

                    icon_url = icon_col.find('a')['href']
                    name_tag = name_col.find('a')
                    name = name_tag.text.strip()

                    # Download the trophy image if it doesn't already exist
                    img_filename = f'trophies/{name.replace(" ", "_").lower()}.png'
                    if not os.path.exists(img_filename):
                        img_response = requests.get(icon_url)
                        with open(img_filename, 'wb') as img_file:
                            img_file.write(img_response.content)
                        print(f"Downloaded image for {name}.")
                    else:
                        print(f"Image for {name} already exists.")

    print("Trophy images downloaded successfully.")
else:
    print(f"Failed to fetch the page. Status code: {response.status_code}")
