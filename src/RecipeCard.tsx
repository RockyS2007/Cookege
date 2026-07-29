import { Link } from 'react-router-dom';

import type { recipe } from "./types";


function RecipeCard( recipeDetails: recipe ) {
    return(
        <Link to={`/recipe/${recipeDetails.id}`} className="recipe-link">
            <div className="recipe">
                <img className="recipe-image" src={recipeDetails.image_link} alt="meal picture"></img>
                <h2 className="recipe-title">{recipeDetails.recipe_name}</h2>

                <div className="recipe-information">
                    
                    Total Cooking time: ~{recipeDetails.total_time_min} mins <br/>
                    Serves: {recipeDetails.servings} <br/>
                    <hr className="recipe-divider"/>
                    <b>Requirements</b> <br/>
                    Oven: {recipeDetails.oven_required ? "yes": "no"} <br/>
                    Stove: {recipeDetails.stove_required ? "yes": "no"} <br/>
                    Microwave: {recipeDetails.microwave_required ? "yes": "no"} <br/>
                                                    
                </div>
            </div>
        </Link>
    );
}

export default RecipeCard;