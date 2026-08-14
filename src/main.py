from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

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

class instructions(BaseModel):
    recipe_id: int
    step_num: int
    instruction: str

class ingredient_quantity(BaseModel):
    recipe_id: int
    ingredient_id: int
    quantity: str

class ingredients(BaseModel):
    ingredient_name: str

app = FastAPI()

recipe_link = None
image_link = None


@app.put("/recipe_link/{recipe_link}")
def put_recipe_link(recipe_link: str):
    recipe_link = recipe_link
    print(recipe_link)

@app.put("/image_link/{image_link}")
def put_image_link(image_link: str):
    image_link = image_link
    print(image_link)

