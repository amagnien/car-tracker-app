// src/pages/Settings.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserSettings } from '../services/userService';
import { updateUserSettings } from '../services/userService';
import LoadingSpinner from '../components/LoadingSpinner';
import { ToastContext } from '../contexts/ToastContext';

const Settings = () => {
    const [settings, setSettings] = useState({
        defaultCurrency: 'USD',
        distanceUnit: 'km',
        fuelUnit: 'liters',
        theme: 'light'
    });
    const [loading, setLoading] = useState(true);
    const { userId } = useAuth();

    useEffect(() => {
        const fetchSettings = async () => {
            if (!userId) return;
            try {
                const userSettings = await getUserSettings(userId);
                if (userSettings) {
                    setSettings(userSettings);
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUserSettings(userId, settings);
            alert('Settings updated successfully!');
        } catch (error) {
            console.error('Error updating settings:', error);
            alert('Failed to update settings');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <form onSubmit={handleSubmit} className="max-w-md">
                <div className="mb-4">
                    <label className="block mb-2">Currency</label>
                    <select 
                        value={settings.defaultCurrency}
                        onChange={(e) => setSettings({...settings, defaultCurrency: e.target.value})}
                        className="w-full p-2 border rounded"
                    >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Distance Unit</label>
                    <select 
                        value={settings.distanceUnit}
                        onChange={(e) => setSettings({...settings, distanceUnit: e.target.value})}
                        className="w-full p-2 border rounded"
                    >
                        <option value="km">Kilometers</option>
                        <option value="mi">Miles</option>
                    </select>
                </div>
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Save Settings
                </button>
            </form>
        </div>
    );
};

export default Settings;
