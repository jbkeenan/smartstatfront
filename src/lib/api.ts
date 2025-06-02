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
const API_BASE_URL = 'https://smartstatback.onrender.com';

// Authentication API
export const authApi = {
  login: async (data: LoginRequest) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to login');
    }

    return response.json();
  },

  register: async (data: RegisterRequest) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to register');
    }

    return response.json();
  },

  getProfile: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get profile');
    }

    return response.json();
  },
};

// Properties API
export const propertiesApi = {
  getAll: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get properties');
    }

    return response.json();
  },

  getById: async (token: string, id: number) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get property');
    }

    return response.json();
  },

  create: async (token: string, data: Omit<Property, 'id' | 'user_id'>) => {
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create property');
    }

    return response.json();
  },

  update: async (token: string, id: number, data: Partial<Omit<Property, 'id' | 'user_id'>>) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update property');
    }

    return response.json();
  },

  delete: async (token: string, id: number) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete property');
    }

    return response.json();
  },
};

// Thermostats API
export const thermostatsApi = {
  getAll: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/thermostats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get thermostats');
    }

    return response.json();
  },

  getById: async (token: string, id: number) => {
    const response = await fetch(`${API_BASE_URL}/thermostats/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get thermostat');
    }

    return response.json();
  },

  getByProperty: async (token: string, propertyId: number) => {
    const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/thermostats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get thermostats for property');
    }

    return response.json();
  },

  create: async (token: string, data: Omit<Thermostat, 'id' | 'is_online' | 'last_temperature' | 'last_updated'>) => {
    const response = await fetch(`${API_BASE_URL}/thermostats`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create thermostat');
    }

    return response.json();
  },

  update: async (token: string, id: number, data: Partial<Omit<Thermostat, 'id' | 'is_online' | 'last_temperature' | 'last_updated'>>) => {
    const response = await fetch(`${API_BASE_URL}/thermostats/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update thermostat');
    }

    return response.json();
  },

  delete: async (token: string, id: number) => {
    const response = await fetch(`${API_BASE_URL}/thermostats/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete thermostat');
    }

    return response.json();
  },

  setTemperature: async (token: string, id: number, temperature: number, isCooling: boolean) => {
    const response = await fetch(`${API_BASE_URL}/thermostats/${id}/temperature`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        temperature,
        mode: isCooling ? 'cooling' : 'heating',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to set temperature');
    }

    return response.json();
  },

  setPower: async (token: string, id: number, power: 'on' | 'off') => {
    const response = await fetch(`${API_BASE_URL}/thermostats/${id}/power`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        power,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to set power');
    }

    return response.json();
  },
};

// Calendars API
export const calendarsApi = {
  getAll: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/calendars`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get calendars');
    }

    return response.json();
  },

  getById: async (token: string, id: number) => {
    const response = await fetch(`${API_BASE_URL}/calendars/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get calendar');
    }

    return response.json();
  },

  getByProperty: async (token: string, propertyId: number) => {
    const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/calendars`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get calendars for property');
    }

    return response.json();
  },

  create: async (token: string, data: Omit<Calendar, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/calendars`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create calendar');
    }

    return response.json();
  },

  update: async (token: string, id: number, data: Partial<Omit<Calendar, 'id'>>) => {
    const response = await fetch(`${API_BASE_URL}/calendars/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update calendar');
    }

    return response.json();
  },

  delete: async (token: string, id: number) => {
    const response = await fetch(`${API_BASE_URL}/calendars/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete calendar');
    }

    return response.json();
  },

  sync: async (token: string, id: number) => {
    const response = await fetch(`${API_BASE_URL}/calendars/${id}/sync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to sync calendar');
    }

    return response.json();
  },
};

// Schedules API
export const schedulesApi = {
  getAll: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/schedules`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get schedules');
    }

    return response.json();
  },

  getById: async (token: string, id: number) => {
    const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get schedule');
    }

    return response.json();
  },

  getByThermostat: async (token: string, thermostatId: number) => {
    const response = await fetch(`${API_BASE_URL}/thermostats/${thermostatId}/schedules`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get schedules for thermostat');
    }

    return response.json();
  },

  create: async (token: string, data: Omit<Schedule, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/schedules`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create schedule');
    }

    return response.json();
  },

  update: async (token: string, id: number, data: Partial<Omit<Schedule, 'id'>>) => {
    const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update schedule');
    }

    return response.json();
  },

  delete: async (token: string, id: number) => {
    const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete schedule');
    }

    return response.json();
  },

  toggle: async (token: string, id: number, isActive: boolean) => {
    const response = await fetch(`${API_BASE_URL}/schedules/${id}/toggle`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        is_active: isActive,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to toggle schedule');
    }

    return response.json();
  },
};
