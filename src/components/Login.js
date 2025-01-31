import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import './styles/Auth.css';

const Login = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            showToast('Successfully logged in', 'success');
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
            showToast(error.message, 'error');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Welcome Back</h1>
                <p className="auth-subtitle">Please sign in to continue</p>

                {error && <p className="error">{error}</p>}

                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={error ? 'error' : ''}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={error ? 'error' : ''}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="auth-submit"
                    >
                        Login
                    </button>
                </form>

                <div className="auth-links">
                    <Link to="/forgot-password" className="forgot-password">
                        Forgot Password?
                    </Link>
                    <p className="auth-redirect">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login; 