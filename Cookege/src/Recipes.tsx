function Recipes() {
    const recipe1: string = 'Pizza';
    const recipe2: string = 'Hamburger';

    return(
        <ul>
            <li>Taco</li>
            <li>{recipe1}</li>
            <li>{recipe2.toUpperCase()}</li>
        </ul>
    );
}

export default Recipes; 