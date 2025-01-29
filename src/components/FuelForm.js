// src/components/FuelForm.js
import React, { useState } from 'react';
import { addFuel } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';


const FuelForm = () => {
    const [date, setDate] = useState('');
    const [liters, setLiters] = useState('');
    const [pricePerLiter, setPricePerLiter] = useState('');
    const [mileage, setMileage] = useState('');
    const { userId } = useAuth();


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!date || !liters || !pricePerLiter || !mileage) {
            return
        }
        const fuelData = {
            date: date,
            liters: parseFloat(liters),
            pricePerLiter: parseFloat(pricePerLiter),
            mileage: parseFloat(mileage)
        };

        await addFuel(fuelData, userId);
        setDate('');
        setLiters('');
        setPricePerLiter('');
        setMileage('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="date"
                placeholder="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <input
                type="number"
                placeholder="Liters"
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
            />
            <input
                type="number"
                placeholder="Price Per Liter"
                value={pricePerLiter}
                onChange={(e) => setPricePerLiter(e.target.value)}
            />
            <input
                type="number"
                placeholder="Mileage"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
            />
            <button type="submit">Add Fuel Record</button>
        </form>
    );
};

export default FuelForm;
