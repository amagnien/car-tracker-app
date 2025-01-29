// src/pages/Login.js
import React, { useState } from 'react';
import {loginUser} from "../services/auth";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useAuth();


  const handleSubmit = async (e) => {
        e.preventDefault();
    try {
      const response = await loginUser(email, password);
        if(response && response.user) {
          setUser(response.user)
            navigate('/')
        } else {
          setError('Login Failed')
        }

    } catch (error) {
            setError(error.message)
    }

    };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
