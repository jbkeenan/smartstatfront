import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import PrivateRoute from './components/shared/PrivateRoute';
import EnhancedLandingPage from './components/EnhancedLandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import PropertiesPage from './pages/properties/PropertiesPage';
import ThermostatsPage from './pages/thermostats/ThermostatsPage';
// Removed unused import
import CalendarsPage from './pages/calendars/CalendarsPage';
import BusinessAnalysisPage from './pages/business-analysis/BusinessAnalysisPage';
import FAQPage from './components/FAQPage';
import Layout from './components/shared/Layout';
import ErrorHandler from './components/shared/ErrorHandler';
import './App.css';

function App() {
  return (
    <Router>
      <ErrorHandler error={null}>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<EnhancedLandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/faq" element={<FAQPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/properties" element={
              <PrivateRoute>
                <Layout>
                  <PropertiesPage />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/properties/:propertyId/thermostats" element={
              <PrivateRoute>
                <Layout>
                  <ThermostatsPage />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/properties/:propertyId/calendar" element={
              <PrivateRoute>
                <Layout>
                  <CalendarsPage />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/business-analysis" element={
              <PrivateRoute>
                <Layout>
                  <BusinessAnalysisPage />
                </Layout>
              </PrivateRoute>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ErrorHandler>
    </Router>
  );
}

export default App;
