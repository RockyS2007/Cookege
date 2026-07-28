import Header from "./Header"
import Footer from "./Footer";
import Button from "./Button";
import ProfilePicture from "./ProfilePicture";
import MyComponent from "./MyComponent";
import MyComponent2 from "./MyComponent2";
import MyComponent3 from "./MyComponent3";
import MyArray from "./MyArray";
import MyCars from "./MyCars";
import MyComponent4 from "./MyComponent4";
import WidthHeight from "./WidthHeight";
import Reference from "./Reference";
import DisplayRecipesHorizontally from "./DisplayRecipesHorizontally";
import RecipePage from "./RecipePage";


import type { RecipeCardProps } from "./RecipeCard";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RecipeCard from "./RecipeCard";

const taco: RecipeCardProps = {
    recipe_id: 1,
    recipe_name: "taco",
    total_time_min: 15,
    servings: 2,
    oven_required: false,
    stove_required: false,
    microwave_required: true,
    image_url: "./src/assets/Griddle-Tacos.jpg"
}

function App() {

  return(
    <>
      <Header/>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DisplayRecipesHorizontally recipes={[taco, taco, taco, taco, 
                                                                         taco, taco, taco, taco]}/>} />
          <Route path="/recipe/:id" element={<RecipePage />} />
        </Routes>
      </BrowserRouter>

      <ProfilePicture/>
      <Button/>
      <MyComponent/>
      <MyComponent2/>
      <MyComponent3/>
      <MyArray/>
      <MyCars/>
      <MyComponent4/>
      <WidthHeight/>
      <Reference/>
      <Footer/>
    </>
  );
}

export default App

// Think about extending this project with tailwind
