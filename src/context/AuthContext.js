import React, { createContext, useState, useEffect, useCallback } from 'react';

// Define the context type
export type AuthContextType = {
  isAuthenticated: boolean;
  user: { id: string; username: string } | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
};

// Define the props type for the AuthProvider
export type AuthProviderProps = {
  children: React.ReactNode;
};

// Initialize the context with default values
const authContext = {
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
  checkAuth: async () => {},
};

// Create the Auth context
const AuthContext = createContext<AuthContextType>(authContext);

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(authContext.isAuthenticated);
  const [user, setUser] = useState<AuthContextType['user']>(authContext.user);

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
    }, []);
  
  
  useEffect(() => {
      checkAuth();
  }, [checkAuth]);


  const login = async (username: string, password: string) => {
    try {
        if (username === 'user' && password === 'password') {
          const userId = 'user-123';
          setUser({ id: userId, username });
          setIsAuthenticated(true);
          localStorage.setItem('authToken', userId);
        } else {
            setIsAuthenticated(false);
             setUser(null);
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        console.error('Login failed:', error);
        setIsAuthenticated(false);
        setUser(null)
        throw new Error('Login failed');
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
        console.error('Logout failed:', error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
      checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;