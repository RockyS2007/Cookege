# Python ingredient object
class Ingredient:
    # Attributes for all ingredients
    name: str
    quantity: str

    # TODO: May need to write custom hash for this
    def __init__(self, name: str, quantity: str) -> None:
        """Initialize a new ingredient"""
        self.name = name
        self.quantity = quantity


# Python recipe object
class Recipe:
    # Attributes for all recipes
    recipe_id: int
    name: str
    ingredients: set[Ingredient]
    description: str

    # In our db we have the recipe_id be the primary key
    # and the list of Ingredients foreign key be recipe_id

    toal_cook_time_min: int
    instructions: list[str] # In order

    servings: int
    oven_required: bool
    stove_required: bool
    microwavable: bool

    # Reference to orignal recipe
    og_link: str


    def __init__(self, recipe_id: int, name: str, description: str, total_cook_time_min: int,
                 servings: int, oven_required: bool, stove_required: bool, 
                 microwavable: bool, og_link: str) -> None:
        """Initialize a new recipe"""
        self.recipe_id = recipe_id
        self.name = name
        self.description = description
        self.og_link = og_link

        self.total_cook_time_min = total_cook_time_min
        self.servings = servings

        self.oven_required = oven_required
        self.stove_required = stove_required
        self.microwavable = microwavable

    def add_ingredient(self, ingredient: str) -> None:
        """Add a new ingrient to this recipe if it doesn't already exist"""
        if ingredient not in self.ingredients:
            self.ingredients.add(ingredient)

    def add_next_instruction(self, instruction: str) -> None:
        """Add the next instruction in the recipe"""
        self.instructions.append(instruction)

    def update_cook_time(self, total_cook_time_min: int) -> None:
        self.toal_cook_time_min = total_cook_time_min
    