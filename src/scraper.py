# For educational purposes only
from __future__ import annotations
from bs4 import BeautifulSoup
from curl_cffi import requests

import unicodedata
from fractions import Fraction

OVEN_KEYWORDS = ["oven"]
STOVE_KEYWORDS = ["skillet", "stove", "medium heat", "griddle"]
MICROWAVE_KEYWORDS = ["microwave"]

BASE_MODEL_MAPPING = {}

def time_to_mins(time: str) -> int:
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
        # idek if this is a real case but im not tryna find out
        mins = int(tokenized[tokenized.index("min") - 1])

    return hours * 60 + mins

def find_detail_content(target_title: str, soup: BeautifulSoup) -> str:
    item = next(x.find(class_="mm-recipes-details__value").string 
                for x in soup.find_all(class_="mm-recipes-details__item") 
                if x.find(class_="mm-recipes-details__label").string == target_title).strip()
    return item

def clean_text(original: str) -> str:
    cleaned = []

    for ch in original:
        if 'FRACTION' in unicodedata.name(ch):
            decimal =unicodedata.numeric(ch)
            frac = Fraction(decimal).limit_denominator()
            cleaned.append(f"{frac.numerator}/{frac.denominator}")
        else:
            cleaned.append(ch)

    return "".join(cleaned)

def return_ingredients(recipe_link: str) -> dict[str, list[str]] | None:
    list_name = "mm-recipes-structured-ingredients__list"
    item_name = "mm-recipes-structured-ingredients__list-item"

    if not recipe_link:
        return None
    
    try:
        response = requests.get(recipe_link, impersonate="chrome")
        soup = BeautifulSoup(response.content, "html.parser")

        ingredients = []
        
        for ingredient in soup.find(class_=list_name).find_all(class_=item_name):
            items = ingredient.find("p").find_all("span")
            if len(items) == 2:
                ingredients.append(items[1].text)
            elif len(items) == 3:
                ingredients.append(items[2].text)
    
        return {"ingredients_list": ingredients}
    except Exception:
        print("Error in retrieving ingredient details")
        return None

def return_quantities(recipe_link: str) -> dict[str, list[str]] | None:
    list_name = "mm-recipes-structured-ingredients__list"
    item_name = "mm-recipes-structured-ingredients__list-item"

    if not recipe_link:
        return None
        
    try:
        response = requests.get(recipe_link, impersonate="chrome")
        soup = BeautifulSoup(response.content, "html.parser")

        quantities = []
        
        for ingredient in soup.find(class_=list_name).find_all(class_=item_name):
            items = ingredient.find("p").find_all("span")
            if len(items) == 2:
                quantities.append(clean_text(items[0].text))
            elif len(items) == 3:
                quantities.append(clean_text(items[0].text + " " + items[1].text))
    
        return {"quantities_list": quantities}
    except Exception:
        print("Error in retrieving quantity details")
        return None

def return_instructions (recipe_link: str) -> dict[str, list[str]] | None:
    list_name = "comp mntl-sc-block mntl-sc-block-startgroup mntl-sc-block-group--LI"
    item_name = "comp mntl-sc-block mntl-sc-block-html"

    if not recipe_link:
        print("missing recipe link")
        return None

    try:
        instructions = []

        response = requests.get(recipe_link, impersonate="chrome")
        soup = BeautifulSoup(response.content, "html.parser")

        for instruction in soup.find_all(class_=list_name):
            instructions.append(instruction.find(class_=item_name).string)

        return {"instructions_list": instructions}

    except Exception:
        print("Error retrieving recipe instructions")
        return None

def return_recipe (recipe_link: str, image_link: str) -> tuple[dict[str, str | int | bool]] | None:
    '''
    Must return the following:
    recipe_name: string, description: string,
    total_time_min: number, servings: number,
    oven_required: boolean, stove_required: boolean,
    microwave_required: boolean, original_link: string, image_link: string
    '''
    recipe = {}

    if not recipe_link or not image_link:
        print("missing recipe or image link")
        return None

    try:
        response = requests.get(recipe_link, impersonate="chrome")
        soup = BeautifulSoup(response.content, "html.parser")
        all_text = soup.get_text()

        recipe["recipe_name"] = soup.find(class_="article-heading text-headline-400").string
        recipe["description"] = soup.find(class_="article-subheading text-utility-300").string
        recipe["total_time_min"] = time_to_mins(find_detail_content("Total Time:", soup))
        recipe["servings"] = int(find_detail_content("Servings:", soup))
        recipe["oven_required"] = any(x in all_text for x in OVEN_KEYWORDS)
        recipe["stove_required"] = any(x in all_text for x in STOVE_KEYWORDS)
        recipe["microwave_required"] = any(x in all_text for x in MICROWAVE_KEYWORDS)
        recipe["original_link"] = recipe_link
        recipe["image_link"] = image_link
    except Exception:
        print("Error in retrieving recipe details")
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
    



