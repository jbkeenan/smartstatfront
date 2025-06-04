import axios, { AxiosError } from 'axios';
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Define types
interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  clearError: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isTestMode: boolean;
  toggleTestMode: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'https://smartstatback.onrender.com/api';

// Test user for test mode
const TEST_USER: User = {
  id: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com'
};

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isTestMode, setIsTestMode] = useState<boolean>(
    localStorage.getItem('thermostat_test_mode') === 'true'
  );
  
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // If test mode is active, use test user
      if (isTestMode) {
        setUser(TEST_USER);
        setIsLoading(false);
        return;
      }
      
      // Check for token in localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      try {
        // Validate token with backend
        const response = await axios.get(`${API_URL}/auth/user/`, {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        
        setUser(response.data);
      } catch (err) {
        console.error('Token validation error:', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, [isTestMode]);

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/auth/login/`, {
        username: email, // Backend expects username field but we use email
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      
      // Redirect to dashboard or intended page
      const origin = location.state?.from?.pathname || '/dashboard';
      navigate(origin);
    } catch (err) {
      console.error('Login error:', err);
      const error = err as Error | AxiosError;
      if (axios.isAxiosError(error) && error.response) {
        setError(new Error(`Login failed: ${JSON.stringify(error.response.data)}`));
      } else {
        setError(new Error(`Login failed: ${error.message}`));
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate a unique username based on name and timestamp
      const timestamp = new Date().getTime().toString().slice(-6);
      const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${timestamp}`;
      
      const response = await axios.post(`${API_URL}/auth/register/`, {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName
      });
      
      // Redirect to login page with success message
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please log in with your credentials.',
          email
        } 
      });
      
      return response.data;
    } catch (err) {
      console.error('Registration error:', err);
      const error = err as Error | AxiosError;
      if (axios.isAxiosError(error) && error.response) {
        setError(new Error(`Registration failed: ${JSON.stringify(error.response.data)}`));
      } else {
        setError(new Error(`Registration failed: ${error.message}`));
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // Toggle test mode
  const toggleTestMode = () => {
    const newTestMode = !isTestMode;
    setIsTestMode(newTestMode);
    localStorage.setItem('thermostat_test_mode', newTestMode.toString());
    
    if (newTestMode) {
      setUser(TEST_USER);
    } else {
      // When disabling test mode, check if there's a real token
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        navigate('/login');
      }
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    clearError,
    login,
    register,
    logout,
    isTestMode,
    toggleTestMode
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
