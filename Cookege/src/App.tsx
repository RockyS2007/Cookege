import Header from "./Header"
import Footer from "./Footer";
import Recipes from "./Recipes";
import Card from "./Card";
import Button from "./Button";
import Recipe from "./Recipe";
import UserGreeting from "./UserGreeting";
import List from "./List";
import ProfilePicture from "./ProfilePicture";
import MyComponent from "./MyComponent";
import Counter from "./Counter";
import MyComponent2 from "./MyComponent2";

function App() {
  const fastFoods = [{id: 1, name: "chicken Wrap", calories: 500},
                    {id: 2, name: "chicken tenders", calories: 700},
                    {id: 3, name: "pizza", calories: 350},
                    {id: 4, name: "tacos", calories: 450},
                    {id: 5, name: "poutine", calories: 600}];

  const cookedFoods = [{id: 6, name: "fried rice", calories: 500},
                    {id: 7, name: "noodles", calories: 700},
                    {id: 8, name: "steak", calories: 350},
                    {id: 9, name: "grilled fish", calories: 450},
                    {id: 10, name: "spaghetti", calories: 600}];


  return(
    <>
      <Header/>
      <Recipes/>
      <Card/>
      <Card/>
      <UserGreeting isLoggedIn={true} username="Rocky"/>
      <Recipe recipe_name="Fried Rice" time={30} microwave_required={false}/>
      <Recipe recipe_name="Noodles" time={45} microwave_required={false}/>
      <Recipe recipe_name="French fries" time={20} microwave_required={true}/>
      {/* Conditional rendering, both these do the same thing */}
      {fastFoods.length > 0 && <List items={fastFoods} category="Fast"/>}
      {cookedFoods.length > 0 ? <List items={cookedFoods} category="Cooked"/>: null}
      <ProfilePicture/>
      <Button/>
      <MyComponent/>
      <MyComponent2/>
      <Counter/>
      <Footer/>
    </>
  );
}

export default App

// Think about extending this project with tailwind
