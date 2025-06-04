import axios from 'axios';

// Base API URL - change this to your Django backend URL
const API_BASE_URL = 'https://smartstatback.onrender.com/api';

// Types
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  created_at: string;
  updated_at: string;
}

export interface Thermostat {
  id: string;
  name: string;
  model: string;
  property_id: string;
  current_temperature?: number;
  target_temperature?: number;
  is_heating: boolean;
  is_cooling: boolean;
  is_online: boolean;
  last_updated?: string;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: string;
  name: string;
  thermostat_id: string;
  target_temperature: number;
  start_time: string;
  end_time: string;
  days_of_week: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Calendar {
  id: string;
  name: string;
  property_id: string;
  url: string;
  is_active: boolean;
  last_synced?: string;
  created_at: string;
  updated_at: string;
}

// API client setup
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Try to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        localStorage.setItem('token', access);
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    // Always use the email directly for login - Django will handle username/email matching
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login/`, { 
        username: email,  // Send the full email as username
        password 
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Extract detailed error message from backend response
        const errorData = error.response.data;
        let errorMessage = 'Login failed: ';
        
        if (typeof errorData === 'object') {
          // Handle structured error responses
          Object.keys(errorData).forEach(key => {
            errorMessage += `${key}: ${errorData[key]} `;
          });
        } else if (typeof errorData === 'string') {
          errorMessage += errorData;
        } else {
          errorMessage += 'Invalid credentials';
        }
        
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  
  register: async (username: string, email: string, password: string, firstName: string, lastName: string) => {
    // Use the provided username parameter (which should be unique)
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register/`, {
        username,  // Use the unique username generated in useAuth
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Extract detailed error message from backend response
        const errorData = error.response.data;
        let errorMessage = 'Registration failed: ';
        
        if (typeof errorData === 'object') {
          // Handle structured error responses
          Object.keys(errorData).forEach(key => {
            errorMessage += `${key}: ${errorData[key]} `;
          });
        } else if (typeof errorData === 'string') {
          errorMessage += errorData;
        } else {
          errorMessage += 'Unknown error';
        }
        
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile/');
    return response.data;
  },
  
  updateProfile: async (data: Partial<User>) => {
    const response = await apiClient.put('/auth/profile/', data);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  },
};

// Properties API
export const propertiesApi = {
  getAll: async () => {
    const response = await apiClient.get('/properties/');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`/properties/${id}/`);
    return response.data;
  },
  
  create: async (data: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await apiClient.post('/properties/', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Property>) => {
    const response = await apiClient.put(`/properties/${id}/`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    await apiClient.delete(`/properties/${id}/`);
  },
};

// Thermostats API
export const thermostatsApi = {
  getAll: async () => {
    const response = await apiClient.get('/thermostats/');
    return response.data;
  },
  
  getByProperty: async (propertyId: string) => {
    const response = await apiClient.get(`/properties/${propertyId}/thermostats/`);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`/thermostats/${id}/`);
    return response.data;
  },
  
  create: async (data: Omit<Thermostat, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await apiClient.post('/thermostats/', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Thermostat>) => {
    const response = await apiClient.put(`/thermostats/${id}/`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    await apiClient.delete(`/thermostats/${id}/`);
  },
  
  setTemperature: async (id: string, temperature: number) => {
    const response = await apiClient.post(`/thermostats/${id}/set-temperature/`, {
      temperature,
    });
    return response.data;
  },
};

// Schedules API
export const schedulesApi = {
  getAll: async () => {
    const response = await apiClient.get('/schedules/');
    return response.data;
  },
  
  getByThermostat: async (thermostatId: string) => {
    const response = await apiClient.get(`/thermostats/${thermostatId}/schedules/`);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`/schedules/${id}/`);
    return response.data;
  },
  
  create: async (data: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await apiClient.post('/schedules/', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Schedule>) => {
    const response = await apiClient.put(`/schedules/${id}/`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    await apiClient.delete(`/schedules/${id}/`);
  },
  
  toggle: async (id: string, isActive: boolean) => {
    const response = await apiClient.post(`/schedules/${id}/toggle/`, {
      is_active: isActive,
    });
    return response.data;
  },
};

// Calendars API
export const calendarsApi = {
  getAll: async () => {
    const response = await apiClient.get('/calendars/');
    return response.data;
  },
  
  getByProperty: async (propertyId: string) => {
    const response = await apiClient.get(`/properties/${propertyId}/calendars/`);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`/calendars/${id}/`);
    return response.data;
  },
  
  create: async (data: Omit<Calendar, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await apiClient.post('/calendars/', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Calendar>) => {
    const response = await apiClient.put(`/calendars/${id}/`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    await apiClient.delete(`/calendars/${id}/`);
  },
  
  sync: async () => {
    const response = await apiClient.post('/calendars/sync/');
    return response.data;
  },
};

// Dashboard API - Client-side aggregation from existing endpoints
export const dashboardApi = {
  getSummary: async () => {
    try {
      // Fetch properties and thermostats from existing endpoints
      const [propertiesResponse, thermostatsResponse] = await Promise.all([
        apiClient.get('/properties/'),
        apiClient.get('/thermostats/')
      ]);
      
      const properties = propertiesResponse.data;
      const thermostats = thermostatsResponse.data;
      
      // Calculate summary metrics
      const total_properties = properties.length;
      const total_thermostats = thermostats.length;
      const active_thermostats = thermostats.filter((t: Thermostat) => t.is_online).length;
      
      // Mock energy savings data (would be calculated from actual data in a real implementation)
      const energy_savings = {
        today: parseFloat((Math.random() * 5).toFixed(2)),
        this_week: parseFloat((Math.random() * 20).toFixed(2)),
        this_month: parseFloat((Math.random() * 50).toFixed(2))
      };
      
      return {
        total_properties,
        total_thermostats,
        active_thermostats,
        energy_savings
      };
    } catch (error) {
      console.error('Error aggregating dashboard data:', error);
      throw new Error('Failed to load dashboard summary data');
    }
  },
  
  getEnergyUsage: async (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
    try {
      // In a real implementation, this would calculate from temperature logs
      // For now, return mock data based on the period
      const dataPoints = period === 'day' ? 24 : 
                         period === 'week' ? 7 : 
                         period === 'month' ? 30 : 12;
      
      const usage = Array.from({ length: dataPoints }, () => ({
        timestamp: new Date().toISOString(),
        value: Math.floor(Math.random() * 10) + 5
      }));
      
      return { period, usage };
    } catch (error) {
      console.error('Error calculating energy usage:', error);
      throw new Error('Failed to load energy usage data');
    }
  },
};

export default apiClient;
