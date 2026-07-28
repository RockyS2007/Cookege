import React, { useState } from 'react';

function MyComponent3() {
    const[ car, setCar ] = useState<any>({year: 2026, 
                                          make: "Toyota", 
                                          model: "Rav 4"});


    function handleYearChange(event) {
        // I thought we would do something like year: event.target.value
        //                                      make: car.make
        //                                      model: car.model
        // but you can just spread the old values and ts will just take the last value for a duplicate key
        setCar(prevCar => ({...prevCar, year: event.target.value}));
    }

    function handleMakeChange(event) {
        setCar(prevCar => ({...prevCar, make: event.target.value}));
    }

    function handleModelChange(event) {
        setCar(prevCar => ({...prevCar, model: event.target.value}));   
    }

    return (
        <div>
            <p>Your favorite car is: {car.year} {car.make} {car.model}</p>

            <input type="number" value={car.year} onChange={handleYearChange}/><br/>
            <input type="text" value={car.make} onChange={handleMakeChange}/><br/>
            <input type="text" value={car.model} onChange={handleModelChange}/><br/>
        </div>
    );
}
export default MyComponent3;