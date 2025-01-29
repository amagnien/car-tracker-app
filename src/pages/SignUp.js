// src/pages/SignUp.js
import React, { useState } from 'react';
import {createUser} from "../services/auth";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useAuth();



    const handleSubmit = async (e) => {
        e.preventDefault();
    try {
      const response = await createUser(email, password);
        if(response && response.user) {
          setUser(response.user)
            navigate('/')
        } else {
           setError('Sign up Failed')
        }
    } catch (error) {
        setError(error.message)
    }
    };

  return (
    <div>
      <h2>Sign Up</h2>
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPage;
