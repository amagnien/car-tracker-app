import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getFuelRecords, addFuelRecord, deleteFuelRecord } from '../services/dataService';
import CarSelector from '../components/CarSelector';
import LoadingSpinner from '../components/LoadingSpinner';

const FuelRecords = () => {
    const [fuelRecords, setFuelRecords] = useState([]);
    const [selectedCarId, setSelectedCarId] = useState('');
    const [loading, setLoading] = useState(true);
    const { userId } = useAuth();

    useEffect(() => {
        if (!userId || !selectedCarId) return;

        const unsubscribe = getFuelRecords(userId, selectedCarId, 
            (records) => {
                setFuelRecords(records);
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching fuel records:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId, selectedCarId]);

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4">Fuel Records</h1>
            <CarSelector 
                selectedCarId={selectedCarId}
                onCarSelect={setSelectedCarId}
            />
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="grid gap-4 mt-4">
                    {fuelRecords.map(record => (
                        <div key={record.id} className="bg-white p-4 rounded shadow">
                            <div className="flex justify-between">
                                <span>{new Date(record.date).toLocaleDateString()}</span>
                                <span>${record.totalCost.toFixed(2)}</span>
                            </div>
                            <div className="mt-2">
                                <p>{record.liters.toFixed(2)} L @ ${record.pricePerLiter.toFixed(3)}/L</p>
                                <p>{record.mileage.toLocaleString()} km</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FuelRecords; 