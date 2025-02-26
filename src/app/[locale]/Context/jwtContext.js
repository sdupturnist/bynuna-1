// JwtContext.js
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiUrl } from '../Utils/variables';

// Create a Context for JWT Token
const JwtContext = createContext();

// Create a custom hook to use the JWT Context
export const useJwt = () => {
  return useContext(JwtContext);
};

// Provider component that wraps the application
export const JwtProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch JWT token
  const getToken = async () => {
    try {
      const response = await fetch(`${apiUrl}wp-json/jwt-auth/v1/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin',
          password: '9WGoFNqepiY@0rvzAIPB0&zg',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch token');
      }

      const data = await response.json();
      setToken(data.token); // Set the token if the response is successful


    } catch (error) {
      setError(error.message); // Catch and set any errors
      console.error('Error fetching token:', error);
    }
  };

  useEffect(() => {
    getToken(); // Fetch token on component mount
  }, []);

  return (
    <JwtContext.Provider value={{ token, error }}>
      {children}
    </JwtContext.Provider>
  );
};
