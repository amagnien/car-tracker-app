import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getCars } from '../services/dataService';

export const useCarList = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useAuth();

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const unsubscribe = getCars(
            userId,
            (carsList) => {
                setCars(carsList);
                setLoading(false);
            },
            (error) => {
                setError(error.message);
                setLoading(false);
            }
        );

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [userId]);

    return {
        cars,
        loading,
        error
    };
}; 