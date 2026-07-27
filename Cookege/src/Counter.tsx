import React, { useState} from 'react';

function Counter() {
    const [ count, setCount ] = useState<number>(0);

    // use an updater function because current state and updated state are not the same
    // since react will put these changes in a queue, so count + 1 then count + 1 has a net effect 
    // of count + 1
    const increment = () => {
        setCount(prevCount => prevCount + 1);
    }

    const decrement = () => {
        setCount(prevCount => prevCount - 1);
    }

    const reset = () => {
        setCount(0);
    }

    return (<div className="counter-container">
                <p className="count-display">{count}</p>
                <button className="counter-button" onClick={decrement}>Decrement</button>
                <button className="counter-button" onClick={reset}>Reset</button>
                <button className="counter-button" onClick={increment}>Increment</button>
            </div>);
}
export default Counter;