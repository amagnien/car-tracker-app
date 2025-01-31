// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { logoutUser } from '../services/auth';

const Navbar = () => {
    const { user, setUser } = useAuth(); // Removed unused 'userId'
    const navigate = useNavigate();

    const handleLogout = async () => {
      try {
        await logoutUser();
        setUser(null);
        navigate('/login');
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };

    return (
        <nav className="navbar">
          <div className="container">
            <Link to="/" className="navbar-brand">Car Tracker</Link>
            <ul className="navbar-nav">
                <li><Link to="/expenses">Expenses</Link></li>
                <li><Link to="/maintenance">Maintenance</Link></li>
                <li><Link to="/fuel">Fuel</Link></li>
                <li><Link to="/analytics">Analytics</Link></li>
                <li><Link to="/cars">My Cars</Link></li>
                 {user ? (
                     <>
                         <li><Link to="/settings">Settings</Link></li>
                         <li>
                             <button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}>
                                 Logout
                             </button>
                         </li>
                     </>
                 ) : (
                   <>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Sign Up</Link></li>
                   </>
                 )}
            </ul>
          </div>
        </nav>
    );
};

export default Navbar;
