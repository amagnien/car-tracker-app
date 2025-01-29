// src/pages/Fuel.js
import React, { useEffect, useState } from 'react';
import FuelForm from '../components/FuelForm';
import {getFuel, deleteFuel} from "../services/dataService";
import { useAuth } from '../hooks/useAuth';

const FuelPage = () => {
    const [fuelList, setFuelList] = useState([]);
    const { userId } = useAuth();
    useEffect(() => {
        if(userId) {
           const unsubscribe =  getFuel(userId, (fuelList) => {
              setFuelList(fuelList)
           });
            return () => unsubscribe()
        }
    }, [userId]);

    const handleDeleteFuel = async (fuelId) => {
      if(userId) {
        await deleteFuel(userId, fuelId)
      }
    };

  return (
      <div>
          <h2>Fuel</h2>
          <FuelForm />
          <ul>
              {fuelList.map((fuel) => (
                  <li key={fuel.id}>
                      {fuel.date} - {fuel.liters} liters - ${fuel.pricePerLiter} per liter - {fuel.mileage} mileage
                       <button onClick={() => handleDeleteFuel(fuel.id)}>Delete</button>
                  </li>
              ))}
          </ul>
      </div>
  );
};

export default FuelPage;
