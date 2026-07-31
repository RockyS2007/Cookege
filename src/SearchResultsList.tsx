import SearchResult from "./SearchResult";
import type { recipe } from "./types";

function SearchResultsList({ results }: { results: recipe[]}) {

    return(<div className="results-list">
            {results.map(result => <SearchResult result={result} key={result.id}/>)}
            </div>);
}

export default SearchResultsList;