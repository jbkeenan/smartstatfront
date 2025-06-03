// API service for communicating with the backend

// Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'maintenance';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface Property {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  user_id: number;
}

export interface Thermostat {
  id: number;
  name: string;
  device_id: string;
  type: 'NEST' | 'CIELO' | 'PIONEER';
  property_id: number;
  is_online: boolean;
  last_temperature?: number;
  last_updated?: string;
  api_key?: string;
  ip_address?: string;
}

export interface Calendar {
  id: number;
  name: string;
  type: 'GOOGLE' | 'ICAL' | 'BOOKING' | 'MANUAL';
  url?: string;
  property_id: number;
  sync_frequency: 'HOURLY' | 'DAILY' | 'MANUAL';
  credentials?: string;
}

export interface Schedule {
  id: number;
  name: string;
  type: 'BOOKING' | 'TIME' | 'OCCUPANCY';
  thermostat_id: number;
  occupied_temp: number;
  unoccupied_temp: number;
  pre_arrival_hours?: number;
  is_active: boolean;
}

// Base API URL
const API_BASE_URL = 'https://smartstatback.onrender.com/api';

// Helper function to handle API errors
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || 'Request failed';
    } catch (e) {
      errorMessage = `${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

// Authentication API
export const authApi = {
  login: async (data: LoginRequest) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      
      return handleApiError(response);
    } catch (err) {
      console.error('Login API error:', err);
      throw err;
    }
  },

  register: async (data: RegisterRequest) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      
      return handleApiError(response);
    } catch (err) {
      console.error('Register API error:', err);
      throw err;
    }
  },

  getProfile: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      
      return handleApiError(response);
    } catch (err) {
      console.error('Get profile API error:', err);
      throw err;
    }
  },
};

// Create a base API request function with authentication
const authenticatedRequest = async (
  endpoint: string, 
  token: string, 
  options: RequestInit = {}
) => {
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });
    
    return handleApiError(response);
  } catch (err) {
    console.error(`API error for ${endpoint}:`, err);
    throw err;
  }
};

// Properties API
export const propertiesApi = {
  getAll: async (token: string) => {
    return authenticatedRequest('/properties', token);
  },

  getById: async (token: string, id: number) => {
    return authenticatedRequest(`/properties/${id}`, token);
  },

  create: async (token: string, data: Omit<Property, 'id' | 'user_id'>) => {
    return authenticatedRequest('/properties', token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  update: async (token: string, id: number, data: Partial<Omit<Property, 'id' | 'user_id'>>) => {
    return authenticatedRequest(`/properties/${id}`, token, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  delete: async (token: string, id: number) => {
    return authenticatedRequest(`/properties/${id}`, token, {
      method: 'DELETE',
    });
  },
};

// Thermostats API
export const thermostatsApi = {
  getAll: async (token: string) => {
    return authenticatedRequest('/thermostats', token);
  },

  getById: async (token: string, id: number) => {
    return authenticatedRequest(`/thermostats/${id}`, token);
  },

  getByProperty: async (token: string, propertyId: number) => {
    return authenticatedRequest(`/properties/${propertyId}/thermostats`, token);
  },

  create: async (token: string, data: Omit<Thermostat, 'id' | 'is_online' | 'last_temperature' | 'last_updated'>) => {
    return authenticatedRequest('/thermostats', token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  update: async (token: string, id: number, data: Partial<Omit<Thermostat, 'id' | 'is_online' | 'last_temperature' | 'last_updated'>>) => {
    return authenticatedRequest(`/thermostats/${id}`, token, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  delete: async (token: string, id: number) => {
    return authenticatedRequest(`/thermostats/${id}`, token, {
      method: 'DELETE',
    });
  },

  setTemperature: async (token: string, id: number, temperature: number, isCooling: boolean) => {
    return authenticatedRequest(`/thermostats/${id}/temperature`, token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        temperature,
        mode: isCooling ? 'cooling' : 'heating',
      }),
    });
  },

  setPower: async (token: string, id: number, power: 'on' | 'off') => {
    return authenticatedRequest(`/thermostats/${id}/power`, token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        power,
      }),
    });
  },
};

// Calendars API
export const calendarsApi = {
  getAll: async (token: string) => {
    return authenticatedRequest('/calendars', token);
  },

  getById: async (token: string, id: number) => {
    return authenticatedRequest(`/calendars/${id}`, token);
  },

  getByProperty: async (token: string, propertyId: number) => {
    return authenticatedRequest(`/properties/${propertyId}/calendars`, token);
  },

  create: async (token: string, data: Omit<Calendar, 'id'>) => {
    return authenticatedRequest('/calendars', token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  update: async (token: string, id: number, data: Partial<Omit<Calendar, 'id'>>) => {
    return authenticatedRequest(`/calendars/${id}`, token, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  delete: async (token: string, id: number) => {
    return authenticatedRequest(`/calendars/${id}`, token, {
      method: 'DELETE',
    });
  },

  sync: async (token: string, id: number) => {
    return authenticatedRequest(`/calendars/${id}/sync`, token, {
      method: 'POST',
    });
  },
};

// Schedules API
export const schedulesApi = {
  getAll: async (token: string) => {
    return authenticatedRequest('/schedules', token);
  },

  getById: async (token: string, id: number) => {
    return authenticatedRequest(`/schedules/${id}`, token);
  },

  getByThermostat: async (token: string, thermostatId: number) => {
    return authenticatedRequest(`/thermostats/${thermostatId}/schedules`, token);
  },

  create: async (token: string, data: Omit<Schedule, 'id'>) => {
    return authenticatedRequest('/schedules', token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  update: async (token: string, id: number, data: Partial<Omit<Schedule, 'id'>>) => {
    return authenticatedRequest(`/schedules/${id}`, token, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  delete: async (token: string, id: number) => {
    return authenticatedRequest(`/schedules/${id}`, token, {
      method: 'DELETE',
    });
  },

  toggle: async (token: string, id: number, isActive: boolean) => {
    return authenticatedRequest(`/schedules/${id}/toggle`, token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        is_active: isActive,
      }),
    });
  },
};
