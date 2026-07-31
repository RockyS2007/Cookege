import Header from "./Header"
import Footer from "./Footer";
import MpbappeSpecial from "./MbappeSpecial";
import DisplayRecipesHorizontally from "./DisplayRecipesHorizontally";
import RecipePage from "./RecipePage";

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { viewFirstNRecipes } from "./supabase-client";

import type { recipe } from "./types";
import SearchBar from "./SearchBar";
import SearchResultsList from "./SearchResultsList";

function App() {
  const [recipes, setRecipes] = useState<recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const [results, setResults] = useState<recipe[]>([]);

  useEffect(() => {
    async function loadRecipes() {
      // The number of recipes to display on the home page
      const result = await viewFirstNRecipes(4);
      setRecipes(result);
      setLoading(false);
    }

    loadRecipes();
  }, []);

  if (loading) {
    return <p>Loading recipes...</p>;
  }

  return(
    <>
      <Header/>
      <BrowserRouter>
        <div className="search-bar-container">
          <SearchBar setResults={setResults}/>
          <SearchResultsList results={results}/>
        </div>

        <MpbappeSpecial/>

        <Routes>
          <Route path="/" element={<DisplayRecipesHorizontally recipes={ recipes }/>} />
          <Route path="/recipe/:id" element={<RecipePage />} />
        </Routes>
      </BrowserRouter>

      <Footer/>
    </>
  );
}

export default App

// Think about extending this project with tailwind
