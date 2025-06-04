import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import PrivateRoute from './components/shared/PrivateRoute';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import PropertiesPage from './pages/properties/PropertiesPage';
import ThermostatsPage from './pages/thermostats/ThermostatsPage';
import SchedulesPage from './pages/schedules/SchedulesPage';
import CalendarsPage from './pages/calendars/CalendarsPage';
import BusinessAnalysisPage from './pages/business-analysis/BusinessAnalysisPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/properties" 
            element={
              <PrivateRoute>
                <PropertiesPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/thermostats" 
            element={
              <PrivateRoute>
                <ThermostatsPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/schedules" 
            element={
              <PrivateRoute>
                <SchedulesPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/calendars" 
            element={
              <PrivateRoute>
                <CalendarsPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/business-analysis" 
            element={
              <PrivateRoute>
                <BusinessAnalysisPage />
              </PrivateRoute>
            } 
          />
          
          {/* Redirect root to dashboard if authenticated, otherwise to login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch all other routes and redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
