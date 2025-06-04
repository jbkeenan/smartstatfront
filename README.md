# Smart Thermostat Automation System - Frontend v6.0

A premium React application for property managers and Airbnb hosts to automate temperature control across all properties, synchronized with booking calendars.

## Features

- **Beautiful Landing Page**: Showcases the benefits and features of the Smart Thermostat Automation System
- **Test Mode**: Easily bypass authentication for testing and demonstration purposes
- **Cross-Brand Compatibility**: Works with multiple thermostat brands through a unified interface
- **Calendar Integration**: Synchronizes with booking calendars to automate temperature adjustments
- **Energy Savings Dashboard**: Track and visualize cost savings across properties
- **Responsive Design**: Works on desktop and mobile devices

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your backend API URL:
```
VITE_API_URL=https://your-backend-api-url.com/api
```

3. Build the application:
```bash
npm run build
```

4. Serve the built application:
```bash
npm run serve
```

## Development

To run the development server:
```bash
npm run dev
```

## Authentication

The application supports two authentication modes:

1. **Normal Mode**: Regular authentication with username/password
2. **Test Mode**: Bypass authentication for testing and demonstration

## Backend Integration

This frontend is designed to work with the Django REST Framework backend. Ensure your backend provides the following API endpoints:

- `/api/auth/login/` - For user authentication
- `/api/auth/register/` - For user registration
- `/api/dashboard/` - For dashboard data
- `/api/properties/` - For property management
- `/api/thermostats/` - For thermostat control
- `/api/schedules/` - For schedule management
- `/api/calendars/` - For calendar integration

## Extensibility

The system is designed to be easily extended with new thermostat brands. The backend can add new thermostat integrations without requiring frontend code changes.

## License

© 2025 Smart Thermostat Automation System. All rights reserved.
