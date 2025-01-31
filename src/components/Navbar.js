// src/components/Navbar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import './styles/Navbar.css';

const Navbar = () => {
    const { user, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <NavLink to="/" className="navbar-brand">
                    <span className="brand-icon">🚗</span>
                    <span className="brand-text">CarTracker</span>
                </NavLink>

                {user ? (
                    <div className="navbar-menu">
                        <div className="nav-links">
                            <NavLink to="/dashboard" className="nav-link">
                                Dashboard
                            </NavLink>
                            <NavLink to="/cars" className="nav-link">
                                My Cars
                            </NavLink>
                            <NavLink to="/expenses" className="nav-link">
                                Expenses
                            </NavLink>
                            <NavLink to="/maintenance" className="nav-link">
                                Maintenance
                            </NavLink>
                            <NavLink to="/fuel" className="nav-link">
                                Fuel
                            </NavLink>
                            <NavLink to="/analytics" className="nav-link">
                                Analytics
                            </NavLink>
                        </div>

                        <div className="navbar-actions">
                            <button 
                                className="theme-toggle"
                                onClick={toggleTheme}
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </button>
                            
                            <div className="user-menu">
                                <button className="user-menu-button">
                                    <img 
                                        src={user.photoURL || '/default-avatar.png'} 
                                        alt="User avatar"
                                        className="user-avatar"
                                    />
                                    <span className="user-name">{user.displayName}</span>
                                </button>
                                <div className="user-dropdown">
                                    <NavLink to="/settings" className="dropdown-item">
                                        Settings
                                    </NavLink>
                                    <button 
                                        onClick={handleSignOut}
                                        className="dropdown-item"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <NavLink to="/login" className="button button-secondary">
                            Log In
                        </NavLink>
                        <NavLink to="/signup" className="button button-primary">
                            Sign Up
                        </NavLink>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
