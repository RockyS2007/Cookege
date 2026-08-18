from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from scraper import return_recipe, return_ingredients, return_quantities, return_instructions

class Recipe(BaseModel):
    recipe_name: str
    description: str
    total_time_min: int
    servings: int
    oven_required: bool
    stove_required: bool
    microwave_required: bool
    original_link: str
    image_link: str
class Ingredients(BaseModel):
    ingredients_list: list[str]
class Quantities(BaseModel):
    quantities_list: list[str]

class Instructions(BaseModel):
    instructions_list: list[str]


app = FastAPI()

# this is the way to handle globals with FastAPI
app.state.recipe_link = None
app.state.image_link = None

class RecipeImageURLs (BaseModel):
    recipe_url: str
    image_url: str


@app.post("/send_links")
def put_recipe_link(url_payload: RecipeImageURLs):
    app.state.recipe_link = url_payload.recipe_url
    app.state.image_link = url_payload.image_url
    print(app.state.recipe_link)
    print(app.state.image_link)

@app.get("/recipe", response_model=Recipe)
def get_recipe():
    print(f"Using recipe: {app.state.recipe_link}")
    print(f"Using image link: {app.state.image_link}")

    recipe = return_recipe(app.state.recipe_link, app.state.image_link)
    if recipe is None:
        raise HTTPException(status_code=404, detail=f"Unable to retrieve recipe")
    print("Recipe successfully retrieved")
    return recipe

@app.get("/ingredients", response_model=Ingredients)
def get_ingredients():
    ingredients = return_ingredients(app.state.recipe_link)
    if ingredients is None:
        raise HTTPException(status_code=404, detail=f"Unable to retrieve ingredients")
    print("Ingredients successfully retrieved")
    print(ingredients)
    return ingredients

@app.get("/quantities", response_model=Quantities)
def get_quantities():
    quantities = return_quantities(app.state.recipe_link)
    if quantities is None:
        raise HTTPException(status_code=404, detail="Unable to retrieve quantities")
    print("Quantities successfully retrieved")
    return quantities

@app.get("/instructions", response_model=Instructions)
def get_instructions():
    instructions = return_instructions(app.state.recipe_link)
    if instructions is None:
        raise HTTPException(status_code=404, detail="Unable to retrieve instructions")
    print("Instructions successfully retrieved")
    return instructions