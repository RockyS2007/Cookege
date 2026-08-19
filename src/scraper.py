# For educational purposes only
from bs4 import BeautifulSoup
from curl_cffi import requests

import unicodedata
from fractions import Fraction

OVEN_KEYWORDS = ["oven"]
STOVE_KEYWORDS = ["skillet", "stove", "medium heat", "griddle"]
MICROWAVE_KEYWORDS = ["microwave"]

# These mappings MUST match the structure of the classes derived from BaseModel in main.py
BASE_MODEL_MAPPING = {
    "ingredients": "ingredients_list",
    "quantities": "quantities_list",
    "instructions": "instructions_list"
}

def time_to_mins(time: str) -> int:
    """
    Return the conversion from hours and minutes to minutes.

    Args:
        time: The time as a string with hours and minutes.

    Returns:
        A integer, the time converted to minutes.
    """
    tokenized = time.split()

    mins = 0
    hours = 0
    if "hr" in tokenized:
        hours = int(tokenized[tokenized.index("hr") - 1])
    if "hrs" in tokenized:
        hours = int(tokenized[tokenized.index("hrs") - 1])
    if "mins" in tokenized:
        mins = int(tokenized[tokenized.index("mins") - 1])
    if "min" in tokenized:
        mins = int(tokenized[tokenized.index("min") - 1])

    return hours * 60 + mins

def clean_text(original: str) -> str:
    """
    Return a cleaned string, which converts unicode fractions into their character parts.

    For example: ½ -> 1/2

    Args:
        original: The original string.

    Returns:
        A cleaned string.
    """
    cleaned = []

    for ch in original:
        if 'FRACTION' in unicodedata.name(ch):
            decimal = unicodedata.numeric(ch)
            frac = Fraction(decimal).limit_denominator()
            cleaned.append(f"{frac.numerator}/{frac.denominator}")
        else:
            cleaned.append(ch)

    return "".join(cleaned)

def find_detail_content(target_title: str, soup: BeautifulSoup) -> str | None:
    """
    Return the total cooking time or servings based on the target title.

    Args:
        target_title: A string with the label which the value is located under.
        soup: The BeautifulSoup object being used for parsing the HTML (this is a helper function).

    Returns:
        The value of contained in the label.
        Returns None if there was an error parsing the HTML.
    """
    DETAILS_VALUE = "mm-recipes-details__value"
    DETAILS_ITEM = "mm-recipes-details__item"
    DETAILS_LABEL = "mm-recipes-details__label"

    try:
        item = next(x.find(class_=DETAILS_VALUE).string 
                    for x in soup.find_all(class_=DETAILS_ITEM) 
                    if x.find(class_=DETAILS_LABEL).string == target_title).strip()
    except Exception as e:
        print(f"Error finding detail content {target_title}.\nDetails: {e}")
        return None
    return item

def extract_ingredient_list_details(recipe_link: str, selected_detail: str) -> list[str] | None:
    """
    Return the list of ingredient names or ingredient quantities based on selected_detail parameter.

    Args:
        recipe_link: The link of an allrecipes.com recipe.
        selected_detail: A string, either "ingredients" or "quantities".

    Returns:
        A list of the specified details for the ingredients of this recipe.
        Returns None if an error occurred in parsing the HTML.
    """
    INGREDIENT_LIST_ELEMENT = "mm-recipes-structured-ingredients__list"
    LIST_ITEM_ELEMENT = "mm-recipes-structured-ingredients__list-item"

    try:
        response = requests.get(recipe_link, impersonate="chrome")
        soup = BeautifulSoup(response.content, "html.parser")

        details = []
        
        for ingredient in soup.find(class_=INGREDIENT_LIST_ELEMENT).find_all(class_=LIST_ITEM_ELEMENT):
            items = ingredient.find("p").find_all("span")
            if len(items) != 3:
                # We will only process ingredients that have exactly the following 3 properties
                #   - data-ingredient-quantity
                #   - data-ingredient-unit
                #   - data-ingredient-name
                continue

            if selected_detail == "quantities":
                raw_text = items[0].text
                if items[1].text != "":
                    raw_text += " " + items[1].text
                details.append(clean_text(raw_text))

            if selected_detail == "ingredients":
                raw_text = items[2].text
                details.append(clean_text(raw_text))
    
        return details
    except Exception as e:
        print(f"Error extracting {selected_detail}\nDetails: {e}")
        return None

def return_ingredients(recipe_link: str) -> dict[str, list[str]] | None:
    """
    Return a list of ingredients wrapped in a dictionary. The expected JSON format for the API.

    The returned value looks like:
    {BASE_MODEL_MAPPING["ingredients"]: [ingredient_1, ingredient_2, ..., ingredient_n]}

    Args:
        recipe_link: The link of an allrecipes.com recipe.

    Returns:
        A dictionary with the list of ingredients for the given recipe.
        Returns None if there was an error parsing the HTML.
    """

    ingredients = extract_ingredient_list_details(recipe_link, "ingredients")
    if ingredients is None:
        print("Unable to retrieve ingredients for this recipe.")
        return None

    return {BASE_MODEL_MAPPING["ingredients"]: ingredients}

def return_quantities(recipe_link: str) -> dict[str, list[str]] | None:
    """
    Return a list of quantities wrapped in a dictionary. The expected JSON format for the API.

    The returned value looks like:
    {BASE_MODEL_MAPPING["quantities"]: [quantity_1, quantity_2, ..., quantity_n]}

    Args:
        recipe_link: The link of an allrecipes.com recipe.

    Returns:
        A dictionary with the list of quantities for the given recipe.
        Returns None if there was an error parsing the HTML.
    """
    quantities = extract_ingredient_list_details(recipe_link, "quantities")
    if quantities is None:
        print("Unable to retrieve quantities for this recipe.")
        return None

    return {BASE_MODEL_MAPPING["quantities"]: quantities}

def return_instructions (recipe_link: str) -> dict[str, list[str]] | None:
    """
    Return a list of instructions wrapped in a dictionary. The expected JSON format for the API.

    The returned value looks like:
    {BASE_MODEL_MAPPING["instructions"]: [step_1, step_2, ..., step_n]}

    Args:
        recipe_link: The link of an allrecipes.com recipe.

    Returns:
        A dictionary with the list of instructions for the given recipe.
        Returns None if there was an error parsing the HTML.
    """

    LIST_NAME = "comp mntl-sc-block mntl-sc-block-startgroup mntl-sc-block-group--LI"
    ITEM_NAME = "comp mntl-sc-block mntl-sc-block-html"

    try:
        instructions = []

        response = requests.get(recipe_link, impersonate="chrome")
        soup = BeautifulSoup(response.content, "html.parser")

        for instruction in soup.find_all(class_=LIST_NAME):
            instructions.append(instruction.find(class_=ITEM_NAME).string)

        return {BASE_MODEL_MAPPING["instructions"]: instructions}

    except Exception as e:
        print(f"Error retrieving recipe instructions\nDetails: {e}")
        return None

def return_recipe (recipe_link: str, image_link: str) -> dict[str, str | int | bool] | None:
    """
    Return a dictionary containing the recipe details. It matches the Recipe class in the API.

    The returned value looks like:
    {
        "recipe_name": ... (str)
        "description": ... (str)
        "total_time_min": ... (int)
        "servings": ... (int)
        "oven_required": ... (bool)
        "stove_required": ... (bool)
        "microwave_required": ... (bool)
        "original_link": recipe_link
        "image_link": image_link
    }

    Args:
        recipe_link: The link of an allrecipes.com recipe.
        image_link: The image address of the main image for the recipe.

    Returns:
        A dictionary with the details of a recipe.
        Returns None if there was an error parsing the HTML or one of the required links is missing.
    """
    recipe = {}

    RECIPE_NAME = "article-heading text-headline-400"
    RECIPE_DESCRIPTION = "article-subheading text-utility-300"

    if not recipe_link or not image_link:
        print("missing recipe or image link")
        return None

    try:
        response = requests.get(recipe_link, impersonate="chrome")
        soup = BeautifulSoup(response.content, "html.parser")
        all_text = soup.get_text()

        recipe["recipe_name"] = soup.find(class_=RECIPE_NAME).string
        recipe["description"] = soup.find(class_=RECIPE_DESCRIPTION).string
        recipe["total_time_min"] = time_to_mins(find_detail_content("Total Time:", soup))
        recipe["servings"] = int(find_detail_content("Servings:", soup))
        recipe["oven_required"] = any(x in all_text for x in OVEN_KEYWORDS)
        recipe["stove_required"] = any(x in all_text for x in STOVE_KEYWORDS)
        recipe["microwave_required"] = any(x in all_text for x in MICROWAVE_KEYWORDS)
        recipe["original_link"] = recipe_link
        recipe["image_link"] = image_link
    except Exception as e:
        print(f"Error in retrieving recipe details\nDetails: {e}")
        return None

    return recipe

if __name__ == "__main__":
    # For debugging purposes
    recipe_link = "https://www.allrecipes.com/ultimate-pool-sandwich-recipe-8653433"
    image_link = "not real image dot com"

    recipe = return_recipe(recipe_link, image_link)
    ingredients = return_ingredients(recipe_link)
    quantities = return_quantities(recipe_link)
    instructions = return_instructions(recipe_link)

    print(f"""
        Recipe Details
        -----------------------------------------------------
        Recipe Name: {recipe["recipe_name"]}
        Recipe Description: {recipe["description"]}
        Recipe Cooking Time (min): {recipe["total_time_min"]}
        Recipe Servings: {recipe["servings"]}
        Recipe Oven Required: {recipe["oven_required"]}
        Recipe Stove Required: {recipe["stove_required"]}
        Recipe Microwave Required: {recipe["microwave_required"]}
        Recipe Link Matches: {recipe["original_link"] == recipe_link}
        Recipe Image Matches: {recipe["image_link"] == image_link}
        -----------------------------------------------------
        """)

    print(f"""
        Ingredient Quantities
        -----------------------------------------------------
        Quantity and Ingredient Count Same: {len(quantities["quantities_list"]) == len(ingredients["ingredients_list"])}
        """, end="")
    for i in range(len(quantities["quantities_list"])):
        print(f"""
        {quantities["quantities_list"][i]} of {ingredients["ingredients_list"][i]}""", end="")
    print("""
        -----------------------------------------------------""")

    print("""
        Instructions
        -----------------------------------------------------""")
    for step, instruction in enumerate(instructions["instructions_list"]):
        print(f"""
        {step+1}: {instruction.strip()}""", end="")
    print("""
        -----------------------------------------------------""")