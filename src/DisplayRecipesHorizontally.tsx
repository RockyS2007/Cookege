import RecipeCard from "./RecipeCard";
import type { recipe } from "./types";

function DisplayRecipesHorizontally ( { recipes }: { recipes: recipe[] } ) {
    const listRecipes = recipes.map(recipe => <RecipeCard key={recipe.id} { ...recipe}/>);

    return(
        <div className="recipe-container">
            {listRecipes}
        </div>);
}

export default DisplayRecipesHorizontally;