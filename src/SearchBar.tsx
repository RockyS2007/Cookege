import { FaSearch } from "react-icons/fa";
import { searchRecipes } from "./supabase-client";
import { useState } from "react";
import type { recipe } from "./types";


function SearchBar({ setResults }: { setResults: React.Dispatch<React.SetStateAction<recipe[]>>}) {
    const [input, setInput] = useState<string>("");
    const [searchResults, setSearchResults] = useState<recipe[]>([]);

    const fetchData = (value: string) => {
        async function performSearch() {
            // Currently returns at most 5 recipes
            const awaitSearchResults = await searchRecipes(value, 5);
            setSearchResults(awaitSearchResults);
        }

        if (value === "") {
            // search results were sticking..., resets the list to empty
            setResults([]);
        } else {
            performSearch();
            setResults(searchResults);
        }
    };

    const handleChange = (value: string) => {
        setInput(value);
        fetchData(value);
    }

    /**
     * maybe im coding the stupidest search bar on earth but when the input changes:
     * -> call handleChange
     *      -> call setInput (useless)
     *      -> call fetchData -> queries results and stores them in searchResults -> sets the searchResults variable in App.tsx 
     */

    return(
            <div className="input-wrapper">
                <FaSearch id="search-icon"/>
                <input placeholder="Search a recipe..." value={input} onChange={(e) => handleChange(e.target.value)}/>
            </div>
    );
}

export default SearchBar;