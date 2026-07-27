import React, { useState, useEffect, useRef } from 'react';

function Reference() {

    // let [ number, setNumber ] = useState(0);

    // object with 1 property, current ({current: argumentPassedIn}), especially useful
    // since it can be HTML, see how ref relats to the input element in the return
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    const inputRef3 = useRef(null);

    useEffect(() => {
        console.log("COMPONENT RENDERED");
    });

    function handleClick1() {
        // this is opposed to useEffect(number + 1);
        inputRef1.current.focus();
        inputRef1.current.style.backgroundColor = "yellow";

        //Reset others
        inputRef2.current.style.backgroundColor = "";
        inputRef3.current.style.backgroundColor = "";
    }

    function handleClick2() {
        // this is opposed to useEffect(number + 1);
        inputRef2.current.focus();
        inputRef2.current.style.backgroundColor = "yellow";

        inputRef1.current.style.backgroundColor = "";
        inputRef3.current.style.backgroundColor = "";
    }

    function handleClick3() {
        // this is opposed to useEffect(number + 1);
        inputRef3.current.focus();
        inputRef3.current.style.backgroundColor = "yellow";

        inputRef1.current.style.backgroundColor = "";
        inputRef2.current.style.backgroundColor = "";
    }

    return(<div>
                <button onClick={handleClick1}>
                Click me 1!
                </button>
                <input ref={inputRef1}></input>

                <button onClick={handleClick2}>
                Click me 2!
                </button>
                <input ref={inputRef2}></input>

                <button onClick={handleClick3}>
                Click me 3!
                </button>
                <input ref={inputRef3}></input>
           </div>
    );
}
export default Reference;