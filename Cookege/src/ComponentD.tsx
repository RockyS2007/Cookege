import React, { useContext } from 'react';
import { UserContext } from './ComponentA';

// using useContext avoids prop drilling, sending the value from the outermost element
// to the inner most one using props

function ComponentD() {

    const user = useContext(UserContext); 

    return(<div className="box">
                <h1>Component D</h1>
                <h2>{`Bye ${user}`}</h2>
           </div>
    );
}
export default ComponentD;