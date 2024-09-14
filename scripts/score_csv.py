import json

# Path to the input JSON file
input_file = "out/trophies_extracted.json"


# Function to extract trophy codes and scores and format them
def format_trophy_codes_scores(input_file):
    # Read the JSON file
    with open(input_file, "r") as f:
        data = json.load(f)

    # Convert the data into the desired "TrophyCode=Score" format
    trophy_list = [f"{trophy['code']}={trophy['score']}" for trophy in data]

    # Join the list into a comma-separated string
    result = ",".join(trophy_list)

    return result


# Execute the function and print the result
if __name__ == "__main__":
    formatted_result = format_trophy_codes_scores(input_file)
    print(formatted_result)
