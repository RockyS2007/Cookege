import { useParams } from "react-router-dom";

// Hard coded testing
import { mayoPancakes, mayoPancakeInstructions, 
        mayoPancakeIngredients, mayoPankcakeIngredientQuantities } from "./mayoPancakes";

import type { recipe, instruction, ingredient, ingredient_quantity } from './types.ts';

function RecipePage() {
    const { id } = useParams();
    const existsRecipe = recipes.find(r => r.recipe_id === Number(id));

    // This is where we would query the DB, hard coded for now
    const recipe: recipe = mayoPancakes;
    const instructions: Array<instruction> = mayoPancakeInstructions;
    const ingredients: Array<ingredient> = mayoPancakeIngredients;
    const quantities: Array<ingredient_quantity> = mayoPankcakeIngredientQuantities;

    // I want to dispaly the quantity and ingredient
    const displayInstructions = instructions.map(instruction => <li>{instruction.instruction_detail}</li>);

    const displayIngredientQuantities = ingredients.map((ingredient) => {
        const matchingQuantity = quantities.find((quantity) => quantity.recipe_id === recipe.id && 
                                                               quantity.ingredient_id === ingredient.ingredient_id);
        return (<li>{matchingQuantity?.quantity} of {ingredient.ingredient_name}</li>)
        
    });

    if (!existsRecipe) {
        return <p>Uh oh! We couldn't cook this one up...</p>
    } else {
        // Here we should query the recipe, it's instructions, ingredients, etc...
        return (
            <div className="recipe-page">
                <h1 className="recipe-name">{recipe.recipe_name}</h1>

                <div className="recipe-display-box">

                    <img className="recipe-image" src="/assets/Griddle-Tacos.jpg" alt={recipe.recipe_name} />

                    <div className="ingredient-list">
                        <h2>Ingredients Needed</h2>
                        <ul>
                            {displayIngredientQuantities}
                        </ul>
                    </div>

                    <div className="recipe-information">
                        <p>
                        Total Cooking time: ~{recipe.total_time_min} mins <br />
                        Serves: {recipe.servings} <br />
                        <br/>
                        <b>Requirements</b> <br />
                        Oven: {recipe.oven_required ? "yes" : "no"} <br />
                        Stove: {recipe.stove_required ? "yes" : "no"} <br />
                        Microwave: {recipe.microwave_required ? "yes" : "no"}
                        </p>
                    </div>

                </div>

                <p className="recipe-description">{recipe.description}</p>


                <div className="recipe-instructions">
                    <h2>Cooking Instructions</h2>
                    <ol>
                        {displayInstructions}
                    </ol>
                </div>

                <a href={recipe.original_link}>Original Recipe</a>
            </div>
        );
    }
}

export default RecipePage;
