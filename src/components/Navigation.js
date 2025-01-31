import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './styles/Navigation.css';

const Navigation = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (!user) return null;

    return (
        <nav className="navigation">
            <div className="nav-brand">
                <Link to="/">Car Tracker</Link>
            </div>
            <div className="nav-links">
                <Link to="/">Dashboard</Link>
                <Link to="/cars">Cars</Link>
                <Link to="/analytics">Analytics</Link>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navigation; 