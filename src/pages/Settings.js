// src/pages/Settings.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserSettings, updateUserSettings, updateUserProfile, changeUserPassword } from '../services/userService';
import { FormCard, FormGroup, FormLabel, FormInput, FormSelect, FormButton } from '../components/common/Form';
import { CURRENCY_LIST } from '../utils/constants';
import '../styles/Settings.css';
import { useToast } from '../hooks/useToast';

const Settings = () => {
    const { user } = useAuth();
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
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { showToast } = useToast();

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const userSettings = await getUserSettings(user.uid);
                if (userSettings) {
                    setSettings(userSettings);
                }
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        };

        if (user) {
            loadSettings();
        }
    }, [user]);

    const handleDarkModeToggle = async () => {
        try {
            const newSettings = {
                ...settings,
                darkMode: !settings.darkMode
            };
            await updateUserSettings(user.uid, newSettings);
            setSettings(newSettings);
            document.documentElement.classList.toggle('dark-mode');
        } catch (error) {
            console.error('Error updating dark mode:', error);
        }
    };

    const handleCurrencyChange = async (e) => {
        try {
            const newSettings = {
                ...settings,
                currency: e.target.value
            };
            await updateUserSettings(user.uid, newSettings);
            setSettings(newSettings);
        } catch (error) {
            console.error('Error updating currency:', error);
        }
    };

    const handleFuelPriceSubmit = async (e) => {
        e.preventDefault();
        const price = e.target.price.value;
        const date = e.target.date.value;

        if (!price || !date) return;

        try {
            const newFuelPrice = {
                price: parseFloat(price),
                date: new Date(date).toISOString()
            };
            
            // Sort fuel prices by date in descending order
            const newFuelPrices = [...settings.fuelPrices, newFuelPrice]
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            
            const newSettings = {
                ...settings,
                fuelPrices: newFuelPrices
            };
            
            await updateUserSettings(user.uid, newSettings);
            setSettings(newSettings);
            showToast('Fuel price updated successfully', 'success');
            e.target.reset();
        } catch (error) {
            console.error('Error adding fuel price:', error);
            showToast('Failed to update fuel price', 'error');
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUserProfile({
                displayName: settings.profile.displayName,
                address: settings.profile.address,
                phone: settings.profile.phone
            });
            setErrors({});
        } catch (error) {
            setErrors({ profile: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!newPassword) return;

        setLoading(true);
        try {
            await changeUserPassword(newPassword);
            setNewPassword('');
            setErrors({});
        } catch (error) {
            setErrors({ password: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-page">
            <h1>Settings</h1>
            
            <div className="settings-grid">
                <FormCard title="Display Settings">
                    <div className="dark-mode-toggle">
                        <span>Dark Mode</span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={settings.darkMode}
                                onChange={handleDarkModeToggle}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>

                    <FormGroup>
                        <FormLabel htmlFor="currency">Currency</FormLabel>
                        <FormSelect
                            id="currency"
                            value={settings.currency}
                            onChange={handleCurrencyChange}
                        >
                            {CURRENCY_LIST.map(currency => (
                                <option key={currency.code} value={currency.code}>
                                    {currency.name} ({currency.code})
                                </option>
                            ))}
                        </FormSelect>
                    </FormGroup>
                </FormCard>

                <FormCard title="Fuel Price Settings">
                    <form onSubmit={handleFuelPriceSubmit} className="fuel-price-input">
                        <FormGroup>
                            <FormLabel htmlFor="price">Price per Liter</FormLabel>
                            <FormInput
                                type="number"
                                id="price"
                                name="price"
                                step="0.001"
                                min="0"
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="date">Date</FormLabel>
                            <FormInput
                                type="date"
                                id="date"
                                name="date"
                                required
                            />
                        </FormGroup>
                        <FormButton type="submit">Add Price</FormButton>
                    </form>

                    <div className="fuel-price-history">
                        <h3>Price History</h3>
                        {settings.fuelPrices.map((price, index) => (
                            <div key={index} className="fuel-price-item">
                                <span>{new Date(price.date).toLocaleDateString()}</span>
                                <span>${price.price.toFixed(3)}/L</span>
                            </div>
                        ))}
                    </div>
                </FormCard>

                <FormCard title="Profile Settings">
                    <form onSubmit={handleProfileSubmit}>
                        <FormGroup>
                            <FormLabel htmlFor="displayName">Display Name</FormLabel>
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
                                value={user?.email || ''}
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

                        {errors.profile && <div className="error-message">{errors.profile}</div>}
                        <FormButton type="submit" loading={loading}>
                            Update Profile
                        </FormButton>
                    </form>
                </FormCard>

                <FormCard title="Change Password">
                    <form onSubmit={handlePasswordChange}>
                        <FormGroup>
                            <FormLabel htmlFor="newPassword">New Password</FormLabel>
                            <FormInput
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                minLength="6"
                            />
                        </FormGroup>

                        {errors.password && <div className="error-message">{errors.password}</div>}
                        <FormButton type="submit" loading={loading}>
                            Change Password
                        </FormButton>
                    </form>
                </FormCard>
            </div>
        </div>
    );
};

export default Settings;
