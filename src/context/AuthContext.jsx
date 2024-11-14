import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for stored authentication status and user data on app load
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('user');

    if (storedAuth === 'true' && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user'); // Clear invalid user data
      }
    }
  }, []);

  // Login logic
  const login = async (userData) => {
    try {
      const response = await fetch('http://127.0.0.1:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setUser(data.user);

        // Save state in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(data.user));

        return { status: 200, message: data.message, user: data.user };
      } else {
        return { status: response.status, error: data.error || 'Failed to login.' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { status: 500, error: 'An error occurred while trying to log in.' };
    }
  };

  const loginAdmin = async (userData) => {
    try {
      const response = await fetch('http://127.0.0.1:3001/api/loginAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setUser(data.user);

        // Save state in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(data.user));

        return { status: 200, message: data.message, user: data.user };
      } else {
        return { status: response.status, error: data.error || 'Failed to login.' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { status: 500, error: 'An error occurred while trying to log in.' };
    }
  };

  // Logout logic
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);

    // Clear localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
