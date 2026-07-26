interface recipeProps {
    recipe_name: string;
    time: number;
    microwave_required: boolean;
}


function Recipe( { recipe_name, time, microwave_required }: recipeProps ) {
    return(
        <div className="recipe">
            <p>Recipe: {recipe_name}</p>
            <p>Cooking Time: {time}</p>
            <p>Needs microwave: {microwave_required ? "Yes": "No"}</p>
        </div>
    );
} 

// no defaultProps, just use default parameters
export default Recipe;