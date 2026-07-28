import { Link } from 'react-router-dom';

export interface RecipeCardProps {
    recipe_id: number;
    recipe_name: string;
    total_time_min: number;
    servings: number;
    oven_required: boolean;
    stove_required: boolean;
    microwave_required: boolean;
    image_url: string;
}

function RecipeCard( { recipe_id, recipe_name, total_time_min, 
                       servings, oven_required, stove_required, 
                       microwave_required, image_url }: RecipeCardProps ) {
    return(
        <Link to={`/recipe/${recipe_id}`} className="recipe-link">
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