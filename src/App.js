// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Expenses from './pages/Expenses';
import Maintenance from './pages/Maintenance';
import Fuel from './pages/Fuel';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { AuthProvider } from './context/authContext';
import './styles/global.css';
import LoginPage from "./pages/Login";
import SignUpPage from "./pages/SignUp";

const App = () => {

    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <div className="app-container">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/fuel" element={<Fuel />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignUpPage />} />
                  </Routes>
                </div>
            </Router>
      </AuthProvider>
    );
};

export default App;
