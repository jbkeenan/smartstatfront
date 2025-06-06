import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://smartstatback.onrender.com/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for token refresh
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Attempt to refresh the token
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        
        // Update stored token
        localStorage.setItem('token', access);
        
        // Update authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Thermostat API service
export const thermostatService = {
  // Get all thermostats for a property
  getThermostats: (propertyId: string) => {
    return api.get(`/properties/${propertyId}/thermostats/`);
  },
  
  // Get a specific thermostat
  getThermostat: (id: string) => {
    return api.get(`/thermostats/${id}/`);
  },
  
  // Add a thermostat to a property
  addThermostat: (propertyId: string, thermostatData: any) => {
    return api.post(`/properties/${propertyId}/thermostats/`, thermostatData);
  },
  
  // Update a thermostat
  updateThermostat: (id: string, thermostatData: any) => {
    return api.put(`/thermostats/${id}/`, thermostatData);
  },
  
  // Remove a thermostat
  removeThermostat: (id: string) => {
    return api.delete(`/thermostats/${id}/`);
  },
  
  // Send command to thermostat
  sendCommand: (id: string, command: any) => {
    return api.post(`/thermostats/${id}/command/`, command);
  },
};

// Property API service
export const propertyService = {
  // Get all properties
  getProperties: () => {
    return api.get('/properties/');
  },
  
  // Get a specific property
  getProperty: (id: string) => {
    return api.get(`/properties/${id}/`);
  },
  
  // Create a new property
  createProperty: (propertyData: any) => {
    return api.post('/properties/', propertyData);
  },
  
  // Update a property
  updateProperty: (id: string, propertyData: any) => {
    return api.put(`/properties/${id}/`, propertyData);
  },
  
  // Delete a property
  deleteProperty: (id: string) => {
    return api.delete(`/properties/${id}/`);
  },
  
  // Get property calendar
  getCalendar: (propertyId: string) => {
    return api.get(`/properties/${propertyId}/calendar/`);
  },
  
  // Add calendar event
  addCalendarEvent: (propertyId: string, eventData: any) => {
    return api.post(`/properties/${propertyId}/calendar/events/`, eventData);
  },
  
  // Update calendar event
  updateCalendarEvent: (propertyId: string, eventId: string, eventData: any) => {
    return api.put(`/properties/${propertyId}/calendar/events/${eventId}/`, eventData);
  },
  
  // Delete calendar event
  deleteCalendarEvent: (propertyId: string, eventId: string) => {
    return api.delete(`/properties/${propertyId}/calendar/events/${eventId}/`);
  },
  
  // Sync with external calendar
  syncCalendar: (propertyId: string, syncData: any) => {
    return api.post(`/properties/${propertyId}/calendar/sync/`, syncData);
  },
  
  // Get property statistics
  getStatistics: (propertyId: string, period?: string) => {
    return api.get(`/properties/${propertyId}/statistics/`, { params: { period } });
  },
};

// Authentication service
export const authService = {
  // Login
  login: (email: string, password: string) => {
    return api.post('/token/', { email, password });
  },
  
  // Register
  register: (userData: any) => {
    return api.post('/users/register/', userData);
  },
  
  // Get user profile
  getProfile: () => {
    return api.get('/users/profile/');
  },
  
  // Update user profile
  updateProfile: (profileData: any) => {
    return api.put('/users/profile/', profileData);
  },
  
  // Refresh token
  refreshToken: (refreshToken: string) => {
    return api.post('/token/refresh/', { refresh: refreshToken });
  },
};

// Thermostat API adapters
export const thermostatAdapters = {
  // Create adapter for specific thermostat brand
  createAdapter: (brand: string, config: any) => {
    switch (brand.toLowerCase()) {
      case 'nest':
        return new NestAdapter(config);
      case 'cielo':
        return new CieloAdapter(config);
      case 'pioneer':
        return new PioneerAdapter(config);
      default:
        return new GenericAdapter(config);
    }
  }
};

// Base adapter class
class ThermostatAdapter {
  config: any;
  
  constructor(config: any) {
    this.config = config;
  }
  
  async getStatus() {
    throw new Error('Method not implemented');
  }
  
  async setTemperature(temp: number) {
    throw new Error('Method not implemented');
  }
  
  async setMode(mode: string) {
    throw new Error('Method not implemented');
  }
}

// Nest adapter implementation
class NestAdapter extends ThermostatAdapter {
  async getStatus() {
    // Implementation for Google Nest API
    return api.get(`/thermostat-api/nest/${this.config.deviceId}/status`);
  }
  
  async setTemperature(temp: number) {
    return api.post(`/thermostat-api/nest/${this.config.deviceId}/temperature`, { temperature: temp });
  }
  
  async setMode(mode: string) {
    return api.post(`/thermostat-api/nest/${this.config.deviceId}/mode`, { mode });
  }
}

// Cielo adapter implementation
class CieloAdapter extends ThermostatAdapter {
  async getStatus() {
    // Implementation for Cielo API
    return api.get(`/thermostat-api/cielo/${this.config.deviceId}/status`);
  }
  
  async setTemperature(temp: number) {
    return api.post(`/thermostat-api/cielo/${this.config.deviceId}/temperature`, { temperature: temp });
  }
  
  async setMode(mode: string) {
    return api.post(`/thermostat-api/cielo/${this.config.deviceId}/mode`, { mode });
  }
}

// Pioneer adapter implementation
class PioneerAdapter extends ThermostatAdapter {
  async getStatus() {
    // Implementation for Pioneer API
    return api.get(`/thermostat-api/pioneer/${this.config.deviceId}/status`);
  }
  
  async setTemperature(temp: number) {
    return api.post(`/thermostat-api/pioneer/${this.config.deviceId}/temperature`, { temperature: temp });
  }
  
  async setMode(mode: string) {
    return api.post(`/thermostat-api/pioneer/${this.config.deviceId}/mode`, { mode });
  }
}

// Generic adapter implementation for other brands
class GenericAdapter extends ThermostatAdapter {
  async getStatus() {
    return api.get(`/thermostat-api/generic/${this.config.deviceId}/status`);
  }
  
  async setTemperature(temp: number) {
    return api.post(`/thermostat-api/generic/${this.config.deviceId}/temperature`, { temperature: temp });
  }
  
  async setMode(mode: string) {
    return api.post(`/thermostat-api/generic/${this.config.deviceId}/mode`, { mode });
  }
}
