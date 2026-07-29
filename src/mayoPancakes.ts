interface recipe {
    id: number;
    recipe_name: string;
    description: string;
    created_at: string;
    total_time_min: number;
    servings: number;
    oven_required: boolean;
    stove_required: boolean;
    microwave_required: boolean;
    original_link: string;
}

interface instruction {
    instruction_id: number;
    recipe_id: number;
    step_num: number;
    instruction_detail: string;
}

interface ingredient {
    ingredient_id: number;
    ingredient_name: string;
}

interface ingredient_quantity {
    recipe_id: number;
    ingredient_id: number;
    quantity: string;
}

export const mayoPancakes: recipe = {
        id: 1,
        recipe_name: "Fluffy Mayo Pancakes",
        description: "Light, tender, easy to make pancakes",
        created_at: "Today",
        total_time_min: 20,
        servings: 4,
        oven_required: false,
        stove_required: true,
        microwave_required: false,
        original_link: "https://www.allrecipes.com/fluffy-mayo-pancakes-recipe-11979757"
    }

const step1: instruction = {
    instruction_id: 1,
    recipe_id: 1,
    step_num: 1,
    instruction_detail: "Whisk together flour, sugar, baking powder, and salt in a bowl and create a well in the center."
}
const step2: instruction = {
    instruction_id: 2,
    recipe_id: 1,
    step_num: 2,
    instruction_detail: "Add mayo, water, and vanilla extract to the well and stir until well combined, then fold the wet ingredients into the dry ingredients and stir until just combined."
}
const step3: instruction = {
    instruction_id: 3,
    recipe_id: 1,
    step_num: 3,
    instruction_detail: "Melt butter over medium heat in a large nonstick skillet or griddle.  Spoon about 1/4 cup batter into the prepared pan and spread it into a round shape."
}
const step4: instruction = {
    instruction_id: 4,
    recipe_id: 1,
    step_num: 4,
    instruction_detail: "Cook, undisturbed, until bubbles form on the surface  and lightly browned around the edges, about 3 minutes. Flip and cook until lightly browned on the second side."
}
export const mayoPancakeInstructions = [step1, step2, step3, step4];

const ing1: ingredient = {
    ingredient_id: 1,
    ingredient_name: "flour"
}
const ing2: ingredient = {
    ingredient_id: 2,
    ingredient_name: "sugar"
}
const ing3: ingredient = {
    ingredient_id: 3,
    ingredient_name: "baking powder"
}
const ing4: ingredient = {
    ingredient_id: 4,
    ingredient_name: "kosher salt"
}
const ing5: ingredient = {
    ingredient_id: 5,
    ingredient_name: "mayonnaise"
}
const ing6: ingredient = {
    ingredient_id: 6,
    ingredient_name: "water"
}
const ing7: ingredient = {
    ingredient_id: 7,
    ingredient_name: "vanilla extract"
}
export const mayoPancakeIngredients = [ing1, ing2, ing3, ing4, ing5, ing6, ing7];

const iq1: ingredient_quantity = {
    recipe_id: 1,
    ingredient_id: 1,
    quantity: "1 1/2 cups"
}
const iq2: ingredient_quantity = {
    recipe_id: 1,
    ingredient_id: 2,
    quantity: "2 1/2 tablespoons"
}
const iq3: ingredient_quantity = {
    recipe_id: 1,
    ingredient_id: 3,
    quantity: "1 1/2 teaspoons"
}
const iq4: ingredient_quantity = {
    recipe_id: 1,
    ingredient_id: 4,
    quantity: "1/4 teasoon"
}
const iq5: ingredient_quantity = {
    recipe_id: 1,
    ingredient_id: 5,
    quantity: "1/2 cup"
}
const iq6: ingredient_quantity = {
    recipe_id: 1,
    ingredient_id: 6,
    quantity: "1 1/4 cups"
}
const iq7: ingredient_quantity = {
    recipe_id: 1,
    ingredient_id: 7,
    quantity: "1 1/2 teaspoons"
}

export const mayoPankcakeIngredientQuantities = [iq1, iq2, iq3, iq4, iq5, iq6, iq7];
