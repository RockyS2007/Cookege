import RecipeCard from "./RecipeCard";
import type { RecipeCardProps } from "./RecipeCard";

function DisplayRecipesHorizontally ( { recipes }: { recipes: RecipeCardProps[] } ) {
    const listRecipes = recipes.map(recipe => <RecipeCard key={recipe.recipe_id} { ...recipe}/>);

    return(
        <div className="recipe-container">
            {listRecipes}
        </div>);
}

export default DisplayRecipesHorizontally;