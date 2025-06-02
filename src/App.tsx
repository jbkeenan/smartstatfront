import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import PropertiesPage from './components/PropertiesPage';
import PropertyDetailPage from './components/PropertyDetailPage';
import PropertyFormPage from './components/PropertyFormPage';
import ThermostatDetailPage from './components/ThermostatDetailPage';
import ThermostatFormPage from './components/ThermostatFormPage';
import CalendarPage from './components/CalendarPage';
import CalendarFormPage from './components/CalendarFormPage';
import SchedulesPage from './components/SchedulesPage';
import ScheduleFormPage from './components/ScheduleFormPage';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          {/* Property routes */}
          <Route path="/properties" element={
            <ProtectedRoute>
              <PropertiesPage />
            </ProtectedRoute>
          } />
          <Route path="/properties/new" element={
            <ProtectedRoute>
              <PropertyFormPage />
            </ProtectedRoute>
          } />
          <Route path="/properties/:id" element={
            <ProtectedRoute>
              <PropertyDetailPage propertyId={1} /> {/* ID would be extracted from params in a real app */}
            </ProtectedRoute>
          } />
          <Route path="/properties/:id/edit" element={
            <ProtectedRoute>
              <PropertyFormPage propertyId={1} /> {/* ID would be extracted from params in a real app */}
            </ProtectedRoute>
          } />
          
          {/* Thermostat routes */}
          <Route path="/thermostats" element={
            <ProtectedRoute>
              <PropertiesPage /> {/* Reusing properties page as entry point */}
            </ProtectedRoute>
          } />
          <Route path="/thermostats/new" element={
            <ProtectedRoute>
              <ThermostatFormPage />
            </ProtectedRoute>
          } />
          <Route path="/thermostats/:id" element={
            <ProtectedRoute>
              <ThermostatDetailPage thermostatId={1} /> {/* ID would be extracted from params in a real app */}
            </ProtectedRoute>
          } />
          <Route path="/thermostats/:id/edit" element={
            <ProtectedRoute>
              <ThermostatFormPage thermostatId={1} /> {/* ID would be extracted from params in a real app */}
            </ProtectedRoute>
          } />
          
          {/* Calendar routes */}
          <Route path="/calendars" element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          } />
          <Route path="/calendars/new" element={
            <ProtectedRoute>
              <CalendarFormPage />
            </ProtectedRoute>
          } />
          <Route path="/calendars/:id/edit" element={
            <ProtectedRoute>
              <CalendarFormPage calendarId={1} /> {/* ID would be extracted from params in a real app */}
            </ProtectedRoute>
          } />
          
          {/* Schedule routes */}
          <Route path="/schedules" element={
            <ProtectedRoute>
              <SchedulesPage />
            </ProtectedRoute>
          } />
          <Route path="/schedules/new" element={
            <ProtectedRoute>
              <ScheduleFormPage />
            </ProtectedRoute>
          } />
          <Route path="/schedules/:id/edit" element={
            <ProtectedRoute>
              <ScheduleFormPage scheduleId={1} /> {/* ID would be extracted from params in a real app */}
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
