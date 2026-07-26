import React, { useState } from 'react';

function MyComponent() {
    const [ name, setName ] = useState<string>("Guest User");  // Variable and setter function
    const [ age, setAge ] = useState<number>(0);
    const [ isEmployed, setEmployment ] = useState<boolean>(false); // oh hell nah

    const updateName = () => {
        setName("SpongeBob");
    }

    const incrementAge = () => {
        setAge(age + 1);
    }

    const toggleEmployedStatus = () => {
        setEmployment(!isEmployed);
    }

    return (
        <div>
            <p>Name: {name}</p>
            <button onClick={updateName}>Set Name</button>

            <p>Age: {age}</p>
            <button onClick={incrementAge}>Increment Age</button>

            <p>Is Employed: {isEmployed ? "Yes": "No"}</p>
            <button onClick={toggleEmployedStatus}>Toggle Employment</button>
        </div>
    );
}
export default MyComponent;