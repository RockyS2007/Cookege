import React, { useState, useEffect} from 'react'

function MyComponent4() {

    const [ count, setCount ] = useState(0);
    const [ color, setColor ] = useState("green");

    useEffect(() => {
        document.title = `Count ${count} ${color}`;
    }, [count, color]);     // pass in an empty dependency array if you only want it to update when the DOM mounts
    // if we pass something into the dependency array, we only call the function when that value changes
    // right now it's the same as if we had no dependcy array at all (it updates on every rerender)

    function addCount() {
        setCount(prevCount => prevCount + 1);
    }

    function subtractCount() {
        setCount(prevCount => prevCount - 1);
    }

    function changeColor() {
        setColor(prevColor => (prevColor === "green" ? "red": "green"));
    }

    return(<>
            <p style={{color: color}}>Count: {count}</p>
            <button onClick={addCount}>Add</button>
            <button onClick={subtractCount}>Subtract</button><br/>
            <button onClick={changeColor}>Change Color</button>
          </>);
}

export default MyComponent4;