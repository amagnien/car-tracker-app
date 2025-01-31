// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/cars" className="nav-link">Cars</Link>
            <Link to="/fuel" className="nav-link">Fuel</Link>
            <Link to="/maintenance" className="nav-link">Maintenance</Link>
            <Link to="/expenses" className="nav-link">Expenses</Link>
            {user ? (
                <button onClick={logout} className="nav-link">Logout</button>
            ) : (
                <Link to="/login" className="nav-link">Login</Link>
            )}
        </nav>
    );
};

export default Navbar;
