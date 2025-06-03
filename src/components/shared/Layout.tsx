import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't show navigation on login and register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/dashboard" className="text-white text-xl font-bold">
                  Smart Thermostat
                </Link>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/dashboard'
                      ? 'border-white text-white'
                      : 'border-transparent text-blue-100 hover:border-blue-300 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/properties"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname.startsWith('/properties')
                      ? 'border-white text-white'
                      : 'border-transparent text-blue-100 hover:border-blue-300 hover:text-white'
                  }`}
                >
                  Properties
                </Link>
                <Link
                  to="/thermostats"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname.startsWith('/thermostats')
                      ? 'border-white text-white'
                      : 'border-transparent text-blue-100 hover:border-blue-300 hover:text-white'
                  }`}
                >
                  Thermostats
                </Link>
                <Link
                  to="/schedules"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname.startsWith('/schedules')
                      ? 'border-white text-white'
                      : 'border-transparent text-blue-100 hover:border-blue-300 hover:text-white'
                  }`}
                >
                  Schedules
                </Link>
                <Link
                  to="/calendars"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname.startsWith('/calendars')
                      ? 'border-white text-white'
                      : 'border-transparent text-blue-100 hover:border-blue-300 hover:text-white'
                  }`}
                >
                  Calendars
                </Link>
                <Link
                  to="/business-analysis"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/business-analysis'
                      ? 'border-white text-white'
                      : 'border-transparent text-blue-100 hover:border-blue-300 hover:text-white'
                  }`}
                >
                  Business Analysis
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                <div className="ml-3 relative">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-white">
                      {user?.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1 rounded-md text-sm font-medium text-blue-100 bg-blue-700 hover:bg-blue-800"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div className="md:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname === '/dashboard'
                  ? 'bg-blue-700 border-white text-white'
                  : 'border-transparent text-blue-100 hover:bg-blue-700 hover:border-blue-300 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/properties"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname.startsWith('/properties')
                  ? 'bg-blue-700 border-white text-white'
                  : 'border-transparent text-blue-100 hover:bg-blue-700 hover:border-blue-300 hover:text-white'
              }`}
            >
              Properties
            </Link>
            <Link
              to="/thermostats"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname.startsWith('/thermostats')
                  ? 'bg-blue-700 border-white text-white'
                  : 'border-transparent text-blue-100 hover:bg-blue-700 hover:border-blue-300 hover:text-white'
              }`}
            >
              Thermostats
            </Link>
            <Link
              to="/schedules"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname.startsWith('/schedules')
                  ? 'bg-blue-700 border-white text-white'
                  : 'border-transparent text-blue-100 hover:bg-blue-700 hover:border-blue-300 hover:text-white'
              }`}
            >
              Schedules
            </Link>
            <Link
              to="/calendars"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname.startsWith('/calendars')
                  ? 'bg-blue-700 border-white text-white'
                  : 'border-transparent text-blue-100 hover:bg-blue-700 hover:border-blue-300 hover:text-white'
              }`}
            >
              Calendars
            </Link>
            <Link
              to="/business-analysis"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname === '/business-analysis'
                  ? 'bg-blue-700 border-white text-white'
                  : 'border-transparent text-blue-100 hover:bg-blue-700 hover:border-blue-300 hover:text-white'
              }`}
            >
              Business Analysis
            </Link>
            <div className="pt-4 pb-3 border-t border-blue-700">
              <div className="flex items-center px-4">
                <div className="text-base font-medium text-white">{user?.email}</div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-blue-100 hover:text-white hover:bg-blue-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
