import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import App from '../App';

// Mock the API calls
jest.mock('../lib/api', () => ({
  authApi: {
    getProfile: jest.fn().mockResolvedValue({ id: '1', email: 'test@example.com' }),
    login: jest.fn().mockResolvedValue({ access: 'fake-token', refresh: 'fake-refresh-token' }),
  },
  thermostatsApi: {
    getAll: jest.fn().mockResolvedValue([]),
  },
  propertiesApi: {
    getAll: jest.fn().mockResolvedValue([]),
  },
  calendarsApi: {
    getAll: jest.fn().mockResolvedValue([]),
  },
  schedulesApi: {
    getAll: jest.fn().mockResolvedValue([]),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'fake-token';
      if (key === 'refresh_token') return 'fake-refresh-token';
      return null;
    });
  });

  test('renders login page when not authenticated', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument();
    });
  });

  test('redirects to dashboard when authenticated', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });
  });
});
