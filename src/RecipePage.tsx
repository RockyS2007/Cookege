import { useParams } from "react-router-dom";
import { foods as recipes} from "./recipe-data";

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

function RecipePage() {
    const { id } = useParams();
    const recipe = recipes.find(r => r.recipe_id === Number(id));

    if (!recipe) {
        return <p>Uh oh! We couldn't cook this one up...</p>
    } else {
        // Here we should query the recipe, it's instructions, ingredients, etc...
        return (
            <div className="recipe-page">
                <img className="recipe-image" src={recipe.image_url} alt="meal picture" />
                <h1>{recipe.recipe_name}</h1>
                <p>
                    Total Cooking time: ~{recipe.total_time_min} mins <br />
                    Serves: {recipe.servings} <br />
                    <b>Requirements</b> <br />
                    Oven: {recipe.oven_required ? "yes" : "no"} <br />
                    Stove: {recipe.stove_required ? "yes" : "no"} <br />
                    Microwave: {recipe.microwave_required ? "yes" : "no"}
                </p>
            </div>
        );
    }

    return(<></>);
}

export default RecipePage;
