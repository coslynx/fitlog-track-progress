import { useContext, useCallback } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../services/api';

/**
 * @typedef {Object} AuthHook
 * @property {boolean} isAuthenticated
 * @property {{id: string, username: string} | null} user
 * @property {(username: string, password: string) => Promise<void>} login
 * @property {() => void} logout
 * @property {() => Promise<void>} checkAuth
 */


/**
 * Custom React hook for authentication logic.
 * @returns {AuthHook} An object containing authentication state and functions.
 */
const useAuth = () => {
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(AuthContext);

  /**
   * Logs in a user with the provided username and password.
   * @param {string} username The username of the user.
   * @param {string} password The password of the user.
   * @throws {Error} If login fails due to invalid credentials or API error.
   */
    const login = async (username, password) => {
        if (!username || !password) {
            console.error('Login failed: Username and password are required.');
            setUser(null);
            setIsAuthenticated(false);
            throw new Error('Username and password are required.');
        }
    
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user: loggedInUser } = response;

      if (!token) {
        console.error('Login failed: Token not received');
          setUser(null);
        setIsAuthenticated(false);
        throw new Error('Login failed: Token not received');
      }
        if (!loggedInUser) {
            console.error('Login failed: User data not received');
            setUser(null);
            setIsAuthenticated(false);
            throw new Error('Login failed: User data not received');
        }


      localStorage.setItem('authToken', token);
      setUser({id: loggedInUser.id, username: loggedInUser.username});
      setIsAuthenticated(true);
        
    } catch (error) {
        console.error('Login failed:', error);
      localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
        throw new Error(error.message || 'Login failed');
    }
  };

  /**
   * Logs out the current user.
   */
  const logout = () => {
      try {
          localStorage.removeItem('authToken');
          setUser(null);
          setIsAuthenticated(false);
      } catch (error) {
          console.error('Logout failed:', error);
      }
  };

  /**
   * Checks if a user is authenticated by verifying the token in local storage.
   * @throws {Error} If an error occurs during token verification or local storage access.
   */
  const checkAuth = useCallback(async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                const userId = token;
                setUser({ id: userId, username: 'user' });
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                setUser(null)
            }
        } catch (error) {
            console.error('Error checking authentication:', error);
            setIsAuthenticated(false);
            setUser(null);
        }
    }, [setIsAuthenticated, setUser]);


    return {
      isAuthenticated,
      user,
      login,
      logout,
      checkAuth,
  };
};

export default useAuth;


/* Example Usage:

// In src/pages/Dashboard.jsx:

import React, { useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const Dashboard = () => {
  const { isAuthenticated, user, logout, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }
    
    const handleLogout = () => {
      logout();
    };

  return (
    <div>
      <h2>Dashboard</h2>
        {user && <p>Welcome {user.username}, ID: {user.id}</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;

*/