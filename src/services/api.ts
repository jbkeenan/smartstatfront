import axios from 'axios';

// Create axios instance with base URL
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for token refresh
api.interceptors.request.use(
  async (config) => {
    // Check if token is expired and refresh if needed
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling token expiration
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
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/token/refresh/`,
          { refresh: refreshToken }
        );
        
        const { access } = response.data;
        
        // Update stored token
        localStorage.setItem('token', access);
        
        // Update authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        delete api.defaults.headers.common['Authorization'];
        
        // Redirect to login page
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication API calls
export const login = async (email: string, password: string) => {
  const response = await api.post('/token/', { email, password });
  return response.data;
};

export const register = async (userData: any) => {
  const response = await api.post('/users/register/', userData);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/users/profile/');
  return response.data;
};

// Thermostat API calls
export const getThermostats = async () => {
  const response = await api.get('/thermostats/');
  return response.data;
};

export const getThermostatsByUser = async () => {
  const response = await api.get('/thermostats/user/');
  return response.data;
};

export const getThermostatsByProperty = async (propertyId: string) => {
  const response = await api.get(`/thermostats/property/${propertyId}/`);
  return response.data;
};

export const getThermostat = async (id: string) => {
  const response = await api.get(`/thermostats/${id}/`);
  return response.data;
};

export const addThermostat = async (thermostatData: any) => {
  const response = await api.post('/thermostats/', thermostatData);
  return response.data;
};

export const updateThermostat = async (id: string, thermostatData: any) => {
  const response = await api.put(`/thermostats/${id}/`, thermostatData);
  return response.data;
};

export const deleteThermostat = async (id: string) => {
  const response = await api.delete(`/thermostats/${id}/`);
  return response.data;
};

export const setThermostatTemperature = async (id: string, temperature: number) => {
  const response = await api.post(`/thermostats/${id}/set-temperature/`, { temperature });
  return response.data;
};

export const setThermostatMode = async (id: string, mode: string) => {
  const response = await api.post(`/thermostats/${id}/set-mode/`, { mode });
  return response.data;
};

// Property API calls
export const getProperties = async () => {
  const response = await api.get('/properties/');
  return response.data;
};

export const getProperty = async (id: string) => {
  const response = await api.get(`/properties/${id}/`);
  return response.data;
};

export const addProperty = async (propertyData: any) => {
  const response = await api.post('/properties/', propertyData);
  return response.data;
};

export const updateProperty = async (id: string, propertyData: any) => {
  const response = await api.put(`/properties/${id}/`, propertyData);
  return response.data;
};

export const deleteProperty = async (id: string) => {
  const response = await api.delete(`/properties/${id}/`);
  return response.data;
};

// Calendar API calls
export const getCalendarEvents = async (propertyId: string) => {
  const response = await api.get(`/calendars/property/${propertyId}/`);
  return response.data;
};

export const addCalendarEvent = async (eventData: any) => {
  const response = await api.post('/calendars/events/', eventData);
  return response.data;
};

export const updateCalendarEvent = async (id: string, eventData: any) => {
  const response = await api.put(`/calendars/events/${id}/`, eventData);
  return response.data;
};

export const deleteCalendarEvent = async (id: string) => {
  const response = await api.delete(`/calendars/events/${id}/`);
  return response.data;
};

// Statistics API calls
export const getStatistics = async (timeRange: string = 'month') => {
  const response = await api.get(`/statistics/?time_range=${timeRange}`);
  return response.data;
};

export const getPropertyStatistics = async (propertyId: string, timeRange: string = 'month') => {
  const response = await api.get(`/statistics/property/${propertyId}/?time_range=${timeRange}`);
  return response.data;
};

export const getThermostatStatistics = async (thermostatId: string, timeRange: string = 'month') => {
  const response = await api.get(`/statistics/thermostat/${thermostatId}/?time_range=${timeRange}`);
  return response.data;
};

// Property service object for easier imports
export const propertyService = {
  getProperties,
  getProperty,
  addProperty,
  updateProperty,
  deleteProperty,
};

// Thermostat service object for easier imports
export const thermostatService = {
  getThermostats,
  getThermostatsByUser,
  getThermostatsByProperty,
  getThermostat,
  addThermostat,
  updateThermostat,
  deleteThermostat,
  setThermostatTemperature,
  setThermostatMode,
};

// Calendar service object for easier imports
export const calendarService = {
  getCalendarEvents,
  addCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
};

// Statistics service object for easier imports
export const statisticsService = {
  getStatistics,
  getPropertyStatistics,
  getThermostatStatistics,
};

// Auth service object for easier imports
export const authService = {
  login,
  register,
  getUserProfile,
};

