import Header from "./Header"
import Footer from "./Footer";
import MpbappeSpecial from "./MbappeSpecial";
import DisplayRecipesHorizontally from "./DisplayRecipesHorizontally";
import RecipePage from "./RecipePage";
import { foods } from "./recipe-data";

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  return(
    <>
      <Header/>

      <MpbappeSpecial/>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DisplayRecipesHorizontally recipes={ foods }/>} />
          <Route path="/recipe/:id" element={<RecipePage />} />
        </Routes>
      </BrowserRouter>

      <Footer/>
    </>
  );
}

export default App

// Think about extending this project with tailwind
