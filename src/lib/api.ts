// API service for communicating with the Django backend
// This file handles all API requests and authentication

const API_BASE_URL = 'https://smartstatback.onrender.com/api';

// Authentication endpoints
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login/',
  REGISTER: '/auth/register/',
  REFRESH: '/auth/token/refresh/',
  VERIFY: '/auth/token/verify/',
  PROFILE: '/auth/profile/',
};

// Thermostat endpoints
const THERMOSTAT_ENDPOINTS = {
  LIST: '/thermostats/',
  DETAIL: (id: string) => `/thermostats/${id}/`,
  SCHEDULE: (id: string) => `/thermostats/${id}/schedule/`,
  LOGS: (id: string) => `/thermostats/${id}/logs/`,
};

// Property endpoints
const PROPERTY_ENDPOINTS = {
  LIST: '/properties/',
  DETAIL: (id: string) => `/properties/${id}/`,
  THERMOSTATS: (id: string) => `/properties/${id}/thermostats/`,
};

// Calendar endpoints
const CALENDAR_ENDPOINTS = {
  LIST: '/calendars/',
  DETAIL: (id: string) => `/calendars/${id}/`,
  SYNC: '/calendars/sync/',
};

// Helper function for authenticated requests
const authenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    // Handle different error status codes
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      throw new Error('Authentication expired. Please log in again.');
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API error: ${response.status}`);
  }
  
  return response.json();
};

// Authentication API
export const authAPI = {
  // Login with email and password
  login: async (email: string, password: string) => {
    try {
      console.log('Attempting login...');
      const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Login API error:', errorData);
        throw new Error(errorData.detail || 'Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Register a new user
  register: async (userData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Registration failed');
      }
      
      return response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Refresh the authentication token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      
      if (!response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        throw new Error('Failed to refresh authentication');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.access);
      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },
  
  // Get user profile
  getProfile: async () => {
    return authenticatedRequest(`${API_BASE_URL}${AUTH_ENDPOINTS.PROFILE}`);
  },
  
  // Update user profile
  updateProfile: async (profileData: any) => {
    return authenticatedRequest(`${API_BASE_URL}${AUTH_ENDPOINTS.PROFILE}`, {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  },
  
  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  },
};

// Thermostat API
export const thermostatAPI = {
  // Get all thermostats
  getAll: async () => {
    return authenticatedRequest(`${API_BASE_URL}${THERMOSTAT_ENDPOINTS.LIST}`);
  },
  
  // Get a specific thermostat
  getById: async (id: string) => {
    return authenticatedRequest(`${API_BASE_URL}${THERMOSTAT_ENDPOINTS.DETAIL(id)}`);
  },
  
  // Create a new thermostat
  create: async (thermostatData: any) => {
    return authenticatedRequest(`${API_BASE_URL}${THERMOSTAT_ENDPOINTS.LIST}`, {
      method: 'POST',
      body: JSON.stringify(thermostatData),
    });
  },
  
  // Update a thermostat
  update: async (id: string, thermostatData: any) => {
    return authenticatedRequest(`${API_BASE_URL}${THERMOSTAT_ENDPOINTS.DETAIL(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(thermostatData),
    });
  },
  
  // Delete a thermostat
  delete: async (id: string) => {
    return authenticatedRequest(`${API_BASE_URL}${THERMOSTAT_ENDPOINTS.DETAIL(id)}`, {
      method: 'DELETE',
    });
  },
  
  // Get thermostat schedule
  getSchedule: async (id: string) => {
    return authenticatedRequest(`${API_BASE_URL}${THERMOSTAT_ENDPOINTS.SCHEDULE(id)}`);
  },
  
  // Update thermostat schedule
  updateSchedule: async (id: string, scheduleData: any) => {
    return authenticatedRequest(`${API_BASE_URL}${THERMOSTAT_ENDPOINTS.SCHEDULE(id)}`, {
      method: 'PUT',
      body: JSON.stringify(scheduleData),
    });
  },
  
  // Get thermostat logs
  getLogs: async (id: string) => {
    return authenticatedRequest(`${API_BASE_URL}${THERMOSTAT_ENDPOINTS.LOGS(id)}`);
  },
};

// Property API
export const propertyAPI = {
  // Get all properties
  getAll: async () => {
    return authenticatedRequest(`${API_BASE_URL}${PROPERTY_ENDPOINTS.LIST}`);
  },
  
  // Get a specific property
  getById: async (id: string) => {
    return authenticatedRequest(`${API_BASE_URL}${PROPERTY_ENDPOINTS.DETAIL(id)}`);
  },
  
  // Create a new property
  create: async (propertyData: any) => {
    return authenticatedRequest(`${API_BASE_URL}${PROPERTY_ENDPOINTS.LIST}`, {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },
  
  // Update a property
  update: async (id: string, propertyData: any) => {
    return authenticatedRequest(`${API_BASE_URL}${PROPERTY_ENDPOINTS.DETAIL(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(propertyData),
    });
  },
  
  // Delete a property
  delete: async (id: string) => {
    return authenticatedRequest(`${API_BASE_URL}${PROPERTY_ENDPOINTS.DETAIL(id)}`, {
      method: 'DELETE',
    });
  },
  
  // Get thermostats for a property
  getThermostats: async (id: string) => {
    return authenticatedRequest(`${API_BASE_URL}${PROPERTY_ENDPOINTS.THERMOSTATS(id)}`);
  },
};

// Calendar API
export const calendarAPI = {
  // Get all calendars
  getAll: async () => {
    return authenticatedRequest(`${API_BASE_URL}${CALENDAR_ENDPOINTS.LIST}`);
  },
  
  // Get a specific calendar
  getById: async (id: string) => {
    return authenticatedRequest(`${API_BASE_URL}${CALENDAR_ENDPOINTS.DETAIL(id)}`);
  },
  
  // Create a new calendar
  create: async (calendarData: any) => {
    return authenticatedRequest(`${API_BASE_URL}${CALENDAR_ENDPOINTS.LIST}`, {
      method: 'POST',
      body: JSON.stringify(calendarData),
    });
  },
  
  // Update a calendar
  update: async (id: string, calendarData: any) => {
    return authenticatedRequest(`${API_BASE_URL}${CALENDAR_ENDPOINTS.DETAIL(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(calendarData),
    });
  },
  
  // Delete a calendar
  delete: async (id: string) => {
    return authenticatedRequest(`${API_BASE_URL}${CALENDAR_ENDPOINTS.DETAIL(id)}`, {
      method: 'DELETE',
    });
  },
  
  // Sync calendars
  sync: async () => {
    return authenticatedRequest(`${API_BASE_URL}${CALENDAR_ENDPOINTS.SYNC}`, {
      method: 'POST',
    });
  },
};

// Export all APIs
export default {
  auth: authAPI,
  thermostats: thermostatAPI,
  properties: propertyAPI,
  calendars: calendarAPI,
};
