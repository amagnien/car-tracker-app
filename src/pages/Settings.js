// src/pages/Settings.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateUserSettings, getUserSettings } from '../services/userService';
import { FormCard, FormGroup, FormLabel, FormInput, FormSelect, FormButton } from '../components/common/Form';
import { CURRENCY_LIST } from '../utils/constants';
import '../styles/Settings.css';

const Settings = () => {
    const { user, updateUserProfile } = useAuth();
    const [settings, setSettings] = useState({
        darkMode: false,
        currency: 'USD',
        fuelPrices: [],
        profile: {
            displayName: '',
            email: '',
            address: '',
            phone: ''
        }
    });
    const [loading, setLoading] = useState(false);
    const [newFuelPrice, setNewFuelPrice] = useState({
        price: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const loadSettings = async () => {
            const userSettings = await getUserSettings(user.uid);
            if (userSettings) {
                setSettings(userSettings);
            }
        };
        loadSettings();
    }, [user.uid]);

    const handleDarkModeToggle = () => {
        const newSettings = {
            ...settings,
            darkMode: !settings.darkMode
        };
        setSettings(newSettings);
        document.documentElement.setAttribute('data-theme', newSettings.darkMode ? 'dark' : 'light');
        updateUserSettings(user.uid, newSettings);
    };

    const handleCurrencyChange = (e) => {
        const newSettings = {
            ...settings,
            currency: e.target.value
        };
        setSettings(newSettings);
        updateUserSettings(user.uid, newSettings);
    };

    const handleAddFuelPrice = async (e) => {
        e.preventDefault();
        if (!newFuelPrice.price || !newFuelPrice.date) return;

        const updatedFuelPrices = [
            ...settings.fuelPrices,
            {
                price: parseFloat(newFuelPrice.price),
                date: new Date(newFuelPrice.date).toISOString(),
                timestamp: new Date().toISOString()
            }
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        const newSettings = {
            ...settings,
            fuelPrices: updatedFuelPrices
        };

        setSettings(newSettings);
        await updateUserSettings(user.uid, newSettings);
        setNewFuelPrice({ price: '', date: new Date().toISOString().split('T')[0] });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUserProfile(settings.profile);
            const newSettings = {
                ...settings,
                profile: settings.profile
            };
            await updateUserSettings(user.uid, newSettings);
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-page">
            <h1>Settings</h1>

            <div className="settings-grid">
                <FormCard title="Theme Settings">
                    <FormGroup>
                        <div className="dark-mode-toggle">
                            <FormLabel>Dark Mode</FormLabel>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.darkMode}
                                    onChange={handleDarkModeToggle}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </FormGroup>
                </FormCard>

                <FormCard title="Currency Settings">
                    <FormGroup>
                        <FormLabel htmlFor="currency">Currency</FormLabel>
                        <FormSelect
                            id="currency"
                            value={settings.currency}
                            onChange={handleCurrencyChange}
                        >
                            {CURRENCY_LIST.map(currency => (
                                <option key={currency.code} value={currency.code}>
                                    {currency.code} - {currency.name}
                                </option>
                            ))}
                        </FormSelect>
                    </FormGroup>
                </FormCard>

                <FormCard title="Fuel Price Settings">
                    <form onSubmit={handleAddFuelPrice}>
                        <FormGroup>
                            <FormLabel htmlFor="fuelPrice">New Fuel Price</FormLabel>
                            <div className="fuel-price-input">
                                <FormInput
                                    type="number"
                                    step="0.001"
                                    value={newFuelPrice.price}
                                    onChange={(e) => setNewFuelPrice({
                                        ...newFuelPrice,
                                        price: e.target.value
                                    })}
                                    placeholder="Enter price"
                                />
                                <FormInput
                                    type="date"
                                    value={newFuelPrice.date}
                                    onChange={(e) => setNewFuelPrice({
                                        ...newFuelPrice,
                                        date: e.target.value
                                    })}
                                />
                                <FormButton type="submit">Add</FormButton>
                            </div>
                        </FormGroup>
                    </form>

                    <div className="fuel-price-history">
                        <h3>Price History</h3>
                        {settings.fuelPrices.map((price, index) => (
                            <div key={index} className="fuel-price-item">
                                <span>{new Date(price.date).toLocaleDateString()}</span>
                                <span>{price.price.toFixed(3)} {settings.currency}/L</span>
                            </div>
                        ))}
                    </div>
                </FormCard>

                <FormCard title="Profile Settings">
                    <form onSubmit={handleProfileUpdate}>
                        <FormGroup>
                            <FormLabel htmlFor="displayName">Name</FormLabel>
                            <FormInput
                                type="text"
                                id="displayName"
                                value={settings.profile.displayName}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    profile: { ...settings.profile, displayName: e.target.value }
                                })}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <FormInput
                                type="email"
                                id="email"
                                value={settings.profile.email}
                                disabled
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel htmlFor="address">Address</FormLabel>
                            <FormInput
                                type="text"
                                id="address"
                                value={settings.profile.address}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    profile: { ...settings.profile, address: e.target.value }
                                })}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel htmlFor="phone">Phone</FormLabel>
                            <FormInput
                                type="tel"
                                id="phone"
                                value={settings.profile.phone}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    profile: { ...settings.profile, phone: e.target.value }
                                })}
                            />
                        </FormGroup>

                        <FormButton type="submit" loading={loading}>
                            Update Profile
                        </FormButton>
                    </form>
                </FormCard>
            </div>
        </div>
    );
};

export default Settings;
