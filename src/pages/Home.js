// src/pages/Home.js
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
      <div>
        {user ? (
          <h2>Welcome to the Car Tracker App!</h2>
        ) : (
            <h2>Please log in or sign up to use the app</h2>
        )}

      </div>

  );
};

export default Home;
