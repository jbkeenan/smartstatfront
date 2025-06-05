# Smart Thermostat Automation System v6.2

## Overview
This package contains the enhanced frontend for the Smart Thermostat Automation System with critical fixes for authentication, test mode, and API connectivity issues.

## Key Improvements in v6.2
- **Fixed Test Mode Functionality**: Test mode now properly bypasses backend API calls and uses mock data
- **Enhanced Authentication System**: Improved login and registration with better error handling
- **Added Proper Logout from Test Mode**: Users can now exit test mode properly
- **Improved Error Handling**: More robust error handling throughout the application
- **Mock Data System**: Comprehensive mock data for all sections when in test mode

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables
Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=https://smartstatback.onrender.com/api
```

## Deployment to Render

### Automatic Deployment with GitHub
1. Push this code to your GitHub repository
2. Connect your Render account to your GitHub repository
3. Create a new Web Service on Render
4. Select "Static Site" as the service type
5. Set build command: `npm install && npm run build`
6. Set publish directory: `dist`
7. Add environment variable: `VITE_API_URL` pointing to your backend URL
8. Click "Create Web Service"

### Manual Deployment
1. Build the project: `npm run build`
2. Upload the contents of the `dist` folder to your hosting service

## Test Mode
The application includes a test mode that bypasses authentication and uses mock data. This is useful for:
- Demonstrating the application without a backend connection
- Testing the UI without affecting real data
- Showcasing the application to potential users

To activate test mode, click the "Test Mode" toggle on the landing page or login page.

## Architecture
The application is built with:
- Vite
- React
- TypeScript
- Tailwind CSS

The codebase is organized as follows:
- `/src/components`: UI components
- `/src/hooks`: Custom React hooks
- `/src/lib`: Utility functions and API client
- `/src/pages`: Page components

## Troubleshooting
If you encounter issues:
1. Check that the backend API is running and accessible
2. Verify environment variables are set correctly
3. Clear browser cache and local storage
4. Use test mode to verify frontend functionality independently

## Contact
For support or questions, please contact your system administrator.
