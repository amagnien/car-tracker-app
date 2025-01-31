import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-blue-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    <Link 
                        to="/" 
                        className={`text-white ${isActive('/') ? 'font-bold' : ''}`}
                    >
                        Dashboard
                    </Link>
                    <Link 
                        to="/fuel" 
                        className={`text-white ${isActive('/fuel') ? 'font-bold' : ''}`}
                    >
                        Fuel Records
                    </Link>
                    <Link 
                        to="/maintenance" 
                        className={`text-white ${isActive('/maintenance') ? 'font-bold' : ''}`}
                    >
                        Maintenance
                    </Link>
                    <Link 
                        to="/expenses" 
                        className={`text-white ${isActive('/expenses') ? 'font-bold' : ''}`}
                    >
                        Expenses
                    </Link>
                    <Link 
                        to="/settings" 
                        className={`text-white ${isActive('/settings') ? 'font-bold' : ''}`}
                    >
                        Settings
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 