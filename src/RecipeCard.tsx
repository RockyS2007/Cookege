import { Link } from 'react-router-dom';

import type { recipe } from "./types";


function RecipeCard( { id, recipe_name, total_time_min, 
                       servings, oven_required, stove_required, 
                       microwave_required }: recipe ) {
    return(
        <Link to={`/recipe/${id}`} className="recipe-link">
            <div className="recipe">
                <img className="recipe-image" src={image_url} alt="meal picture"></img>
                <h2 className="recipe-title">{recipe_name}</h2>

                <p className="recipe-information">
                    
                    Total Cooking time: ~{total_time_min} mins <br/>
                    Serves: {servings} <br/>
                    <hr className="recipe-divider"/>
                    <b>Requirements</b> <br/>
                    Oven: {oven_required ? "yes": "no"} <br/>
                    Stove: {stove_required ? "yes": "no"} <br/>
                    Microwave: {microwave_required ? "yes": "no"} <br/>
                                                    
                </p>
            </div>
        </Link>
    );
}

export default RecipeCard;