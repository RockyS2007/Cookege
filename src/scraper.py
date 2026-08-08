# For educational purposes only
from __future__ import annotations
from bs4 import BeautifulSoup
from curl_cffi import requests
# from urllib.request import urlopen, Request   <- library wasn't able to get past anti-bot system from server

import unicodedata
from fractions import Fraction

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

def find_detail_content(target_title: str) -> str:
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

def ingredient_quantities(soup: BeautifulSoup) -> tuple[list[str], list[str]]:
    list_name = "mm-recipes-structured-ingredients__list"
    item_name = "mm-recipes-structured-ingredients__list-item"

    quantities = []
    ingredients = []

    for ingredient in soup.find(class_=list_name).find_all(class_=item_name):
        items = ingredient.find("p").find_all("span")
        if len(items) == 2:
            quantities.append(clean_text(items[0].text))
            ingredients.append(items[1].text)
        elif len(items) == 3:
            quantities.append(clean_text(items[0].text + " " + items[1].text))
            ingredients.append(items[2].text)

    return quantities, ingredients


oven_keywords = ["oven"]
stove_keywords = ["skillet", "stove", "medium heat", "griddle"]
microwave_keywords = ["microwave"]


url = "https://www.allrecipes.com/recipe/277019/baked-pork-chops-with-cream-of-mushroom-soup/"

response = requests.get(url, impersonate="chrome")
soup = BeautifulSoup(response.content, "html.parser")
all_text = soup.get_text()

recipe_name = soup.find(class_="article-heading text-headline-400").string
description = soup.find(class_="article-subheading text-utility-300").string
total_time_mins = time_to_mins(find_detail_content("Total Time:"))
servings = int(find_detail_content("Servings:"))
image_link = soup.find(class_="img-placeholder").find("img")["src"]
# I want to download this image, rename it, and upload it to S3
oven_required = any(x in all_text for x in oven_keywords)
stove_required = any(x in all_text for x in stove_keywords)
microwave_required = any(x in all_text for x in microwave_keywords)

quantities, ingredients = ingredient_quantities(soup)


print(
f'''
Recipe Name: {recipe_name}
Description: {description}
Total Cooking Time (mins): {total_time_mins}
Servings: {servings}
Oven Required: {oven_required}
Stove Required: {stove_required}
Microwave Required: {microwave_required}
Ingredients list:
'''
)
for i in range(len(ingredients)):
    print(str(i + 1) + ": " + quantities[i] + " " + ingredients[i])

# Need to create an api so the backend can use this