import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, User, LoginRequest, RegisterRequest } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'thermostat_auth_token';
const USER_KEY = 'thermostat_user_data';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load token and user data from localStorage on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (storedToken) {
      setToken(storedToken);
      
      // If we have cached user data, use it immediately to prevent loading state
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setIsLoading(false);
        } catch (e) {
          console.error('Failed to parse stored user data:', e);
          // If parsing fails, fetch fresh data
          fetchUserProfile(storedToken);
        }
      } else {
        // No cached user data, fetch from API
        fetchUserProfile(storedToken);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch user profile with token
  const fetchUserProfile = async (authToken: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.getProfile(authToken);
      setUser(response.user);
      
      // Cache user data
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError('Session expired. Please login again.');
      logout();
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApi.login(data);
      
      // Store token and user data
      setToken(response.token);
      setUser(response.user);
      
      // Cache in localStorage
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      
      console.log('Login successful, token stored:', response.token.substring(0, 10) + '...');
      
      setIsLoading(false);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please try again.');
      setIsLoading(false);
      throw err;
    }
  };

  // Register function
  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      await authApi.register(data);
      setIsLoading(false);
      // After registration, user needs to login
    } catch (err: any) {
      setError(err.message || 'Failed to register. Please try again.');
      setIsLoading(false);
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
