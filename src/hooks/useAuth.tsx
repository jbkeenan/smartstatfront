import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, User } from '../lib/api';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authApi.getProfile();
        setUser(userData);
      } catch (err) {
        console.error('Authentication error:', err);
        // Clear invalid tokens
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const clearError = () => {
    setError(null);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Generate a unique username from email to avoid conflicts
      // This ensures we can always log in with the same email
      const { access, refresh } = await authApi.login(email, password);
      localStorage.setItem('token', access);
      localStorage.setItem('refresh_token', refresh);
      
      const userData = await authApi.getProfile();
      setUser(userData);
      
      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      // Provide a more user-friendly error message
      if (err.message && err.message.includes('Invalid credentials')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(err.message || 'Failed to login. Please check your credentials.');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Generate a unique username from email + timestamp to avoid conflicts
      // This ensures we can register multiple accounts with the same email prefix
      const timestamp = new Date().getTime();
      const username = `${email.split('@')[0]}_${timestamp}`;
      
      await authApi.register(username, email, password, firstName, lastName);
      
      // After registration, redirect to login page instead of auto-login
      setError(null);
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please sign in with your new account.' 
        } 
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Handle specific registration errors
      if (err.message && err.message.includes('username already exists')) {
        setError('This username is already taken. Please try a different one.');
      } else if (err.message && err.message.includes('email already exists')) {
        setError('An account with this email already exists. Please log in instead.');
      } else {
        setError(err.message || 'Failed to register. Please try again.');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
