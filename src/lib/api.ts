import axios from 'axios';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'https://smartstatback.onrender.com/api';

// Error handling helper
const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  if (axios.isAxiosError(error)) {
    // Handle Axios errors with response data
    if (error.response) {
      const statusCode = error.response.status;
      const responseData = error.response.data;
      
      throw new Error(
        `Request failed with status ${statusCode}: ${
          typeof responseData === 'object' 
            ? JSON.stringify(responseData) 
            : responseData || error.message
        }`
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response received from server. Please check your network connection.');
    } else {
      // Error in setting up the request
      throw new Error(`Error setting up request: ${error.message}`);
    }
  }
  
  // For non-Axios errors
  throw error;
};

// Request interceptor for adding auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors globally
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Clear token if it's invalid or expired
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        // Reload the page to reset auth state
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: string;
  square_footage: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  created_at: string;
  updated_at: string;
}

export interface Thermostat {
  id: string;
  name: string;
  property_id: string;
  current_temperature: number;
  target_temperature: number;
  mode: 'heat' | 'cool' | 'auto' | 'off';
  fan_mode: 'auto' | 'on';
  is_online: boolean;
  battery_level: number;
  firmware_version: string;
  created_at: string;
  updated_at: string;
  // Additional fields needed by the UI
  location?: string;
  model?: string;
}

export interface Schedule {
  id: string;
  name: string;
  thermostat_id: string;
  start_time: string;
  end_time: string;
  target_temperature: number;
  days_active: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Calendar {
  id: string;
  name: string;
  description: string;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  calendar_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

// Dashboard API
const dashboard = {
  getSummary: async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/summary/`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getEnergyUsage: async (timeRange: string) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/energy-usage/?time_range=${timeRange}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// API functions for properties
const properties = {
  getAll: async (): Promise<Property[]> => {
    try {
      const response = await axios.get(`${API_URL}/properties/`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getById: async (id: string): Promise<Property> => {
    try {
      const response = await axios.get(`${API_URL}/properties/${id}/`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  create: async (data: Partial<Property>): Promise<Property> => {
    try {
      const response = await axios.post(`${API_URL}/properties/`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  update: async (id: string, data: Partial<Property>): Promise<Property> => {
    try {
      const response = await axios.put(`${API_URL}/properties/${id}/`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/properties/${id}/`);
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// API functions for thermostats
const thermostats = {
  getAll: async (): Promise<Thermostat[]> => {
    try {
      const response = await axios.get(`${API_URL}/thermostats/`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getById: async (id: string): Promise<Thermostat> => {
    try {
      const response = await axios.get(`${API_URL}/thermostats/${id}/`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getByProperty: async (propertyId: string): Promise<Thermostat[]> => {
    try {
      const response = await axios.get(`${API_URL}/properties/${propertyId}/thermostats/`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  create: async (data: Partial<Thermostat>): Promise<Thermostat> => {
    try {
      const response = await axios.post(`${API_URL}/thermostats/`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  update: async (id: string, data: Partial<Thermostat>): Promise<Thermostat> => {
    try {
      const response = await axios.put(`${API_URL}/thermostats/${id}/`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  setTemperature: async (id: string, temperature: number): Promise<Thermostat> => {
    try {
      const response = await axios.post(`${API_URL}/thermostats/${id}/set_temperature/`, {
        target_temperature: temperature
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  setMode: async (id: string, mode: string): Promise<Thermostat> => {
    try {
      const response = await axios.post(`${API_URL}/thermostats/${id}/set_mode/`, {
        mode
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/thermostats/${id}/`);
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// API functions for schedules
const schedules = {
  getAll: async (): Promise<Schedule[]> => {
    try {
      const response = await axios.get(`${API_URL}/schedules/`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getById: async (id: string): Promise<Schedule> => {
    try {
      const response = await axios.get(`${API_URL}/schedules/${id}/`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getByThermostat: async (thermostatId: string): Promise<Schedule[]> => {
    try {
      const response = await axios.get(`${API_URL}/thermostats/${thermostatId}/schedules/`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  create: async (data: Partial<Schedule>): Promise<Schedule> => {
    try {
      const response = await axios.post(`${API_URL}/schedules/`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  update: async (id: string, data: Partial<Schedule>): Promise<Schedule> => {
    try {
      const response = await axios.put(`${API_URL}/schedules/${id}/`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  toggleActive: async (id: string, isActive: boolean): Promise<Schedule> => {
    try {
      const response = await axios.patch(`${API_URL}/schedules/${id}/`, {
        is_active: isActive
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/schedules/${id}/`);
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// API functions for calendars
const calendars = {
  getAll: async (): Promise<Calendar[]> => {
    try {
      const response = await axios.get(`${API_URL}/calendars/`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getById: async (id: string): Promise<Calendar> => {
    try {
      const response = await axios.get(`${API_URL}/calendars/${id}/`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getEvents: async (calendarId: string): Promise<CalendarEvent[]> => {
    try {
      const response = await axios.get(`${API_URL}/calendars/${calendarId}/events/`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  create: async (data: Partial<Calendar>): Promise<Calendar> => {
    try {
      const response = await axios.post(`${API_URL}/calendars/`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  createEvent: async (data: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    try {
      const response = await axios.post(`${API_URL}/calendar-events/`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  update: async (id: string, data: Partial<Calendar>): Promise<Calendar> => {
    try {
      const response = await axios.put(`${API_URL}/calendars/${id}/`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  updateEvent: async (id: string, data: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    try {
      const response = await axios.put(`${API_URL}/calendar-events/${id}/`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/calendars/${id}/`);
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  deleteEvent: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/calendar-events/${id}/`);
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// API functions for business analysis
const businessAnalysis = {
  getAnalytics: async () => {
    try {
      const response = await axios.get(`${API_URL}/business-analysis/`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getEnergyUsage: async (timeRange: string) => {
    try {
      const response = await axios.get(`${API_URL}/business-analysis/energy-usage/?time_range=${timeRange}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getCostSavings: async (timeRange: string) => {
    try {
      const response = await axios.get(`${API_URL}/business-analysis/cost-savings/?time_range=${timeRange}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Export all API functions
export const api = {
  dashboard,
  properties,
  thermostats,
  schedules,
  calendars,
  businessAnalysis
};

// For backward compatibility
export const propertiesApi = properties;
export const thermostatsApi = thermostats;
export const schedulesApi = schedules;
export const calendarsApi = calendars;
export const businessAnalysisApi = businessAnalysis;

export default api;
