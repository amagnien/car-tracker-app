import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';

const AddCar = () => {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, `users/${user.uid}/cars`), {
                make,
                model,
                year,
                createdAt: new Date()
            });
            alert('Car added successfully!');
        } catch (error) {
            console.error('Error adding car:', error);
            alert('Failed to add car');
        }
    };

    return (
        <div className="add-car-container">
            <h2>Add Car</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Make"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                />
                <button type="submit">Add Car</button>
            </form>
        </div>
    );
};

export default AddCar; 