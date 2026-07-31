import type { recipe } from "./types";
import { Link } from 'react-router-dom';

function SearchResult({ result }: { result: recipe }) {
    return(
        <Link to={`/recipe/${result.id}`}>
            <div className="search-result">{result.recipe_name}</div>
        </Link>
        // this means the user clicked on the result so clear the search bar
    );
    
}

export default SearchResult;