import React, { useState, createContext } from "react";
import ComponentB from "./ComponentB";

export const UserContext = createContext();

function ComponentA() {

    const [ user, setUser ] = useState<String>("Rocky");


    // all children of this component (i.e. B, C, D) have access to this context

    return(<div className="box">
                <h1>Component A</h1>
                <h2>{`Hello ${user}`}</h2>
                <UserContext.Provider value={user}>
                    <ComponentB/>
                </UserContext.Provider>
           </div>
    );
}
export default ComponentA;