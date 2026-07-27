import React, { useState } from 'react';

function MyArray() {
    const [ foods, setFoods ] = useState<Array<String>>(["Apple", "Orange", "Banana"]);

    function handleAddFood() {
        // TypeScript specific
        const input = document.getElementById("foodInput") as HTMLInputElement;
        const newFood = input.value;

        let inputElement = document.getElementById("foodInput") as HTMLInputElement;
        inputElement.value = "";

        setFoods(prevFoods => [...prevFoods, newFood]);     // Do all these as updater functions
    }

    function handleRemoveFood(index: number) {
        setFoods(foods.filter((_, i) => i !== index))   // element, index
    }
    
    return(<div>
                <h2>List of Food</h2>
                <ul>
                    {foods.map((food, index) => 
                                <li 
                                    key={index} onClick={() => handleRemoveFood(index)}>{food}
                                </li>)}
                </ul>
                <input type="text" id="foodInput" placeholder="Enter food name"/>
                <button onClick={handleAddFood}>Add Food</button>
            </div>);
}

export default MyArray;