# Smart Thermostat Automation System - Frontend v6.1

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

## GitHub Integration

To set up automatic deployment with GitHub and Render:

1. Push this code to your GitHub repository
2. In Render dashboard, create a new Web Service
3. Connect to your GitHub repository
4. Select "React" as the framework
5. Set the build command to `npm install && npm run build`
6. Set the publish directory to `dist`
7. Add the environment variable `VITE_API_URL` pointing to your backend API

This will automatically deploy your frontend whenever you push changes to your repository.

## Extensibility

The system is designed to be easily extended with new thermostat brands. The backend can add new thermostat integrations without requiring frontend code changes.

## Changelog

### v6.1
- Fixed test mode functionality to properly bypass authentication
- Enhanced error handling for login and registration
- Improved navigation after toggling test mode
- Added debugging for authentication requests
- Fixed state management for test mode toggle

### v6.0
- Added premium landing page with testimonials and benefits
- Implemented responsive design for all device sizes
- Enhanced UI with modern design elements
- Added FAQ section
- Improved overall user experience

## License

© 2025 Smart Thermostat Automation System. All rights reserved.
