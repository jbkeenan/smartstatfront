# Smart Thermostat Automation System - Deployment Guide

This guide provides instructions for deploying the Smart Thermostat Automation System frontend that works seamlessly with the Django backend.

## Prerequisites

- Node.js 16+ and npm
- Access to your Render account
- GitHub repository access (if using GitHub deployment)

## Option 1: Direct Deployment to Render

1. **Log in to your Render dashboard**
   - Go to https://dashboard.render.com/
   - Sign in with your credentials

2. **Navigate to your frontend service**
   - Select the `smartstatfront` service

3. **Update the deployment settings**
   - Go to the "Settings" tab
   - Ensure the following settings are configured:
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Environment Variables**: Make sure `NODE_ENV` is set to `production`

4. **Upload the frontend code**
   - Click on "Manual Deploy" > "Upload Files"
   - Upload the `smart_thermostat_frontend_complete.zip` file
   - Extract the files to replace the existing codebase

5. **Clear build cache and deploy**
   - Click on "Clear build cache" checkbox
   - Click "Deploy" to start the deployment process

6. **Verify the deployment**
   - Once deployment is complete, visit your frontend URL (https://smartstatfront.onrender.com)
   - Verify that you can log in and access all features
   - Test the integration with the backend

## Option 2: GitHub Deployment

1. **Clone your frontend repository**
   ```bash
   git clone https://github.com/jbkeenan/smartstatfront.git
   cd smartstatfront
   ```

2. **Create a backup branch**
   ```bash
   git checkout -b backup-original-frontend
   git push origin backup-original-frontend
   ```

3. **Switch back to main branch**
   ```bash
   git checkout main
   ```

4. **Replace the files**
   ```bash
   # Remove all existing files (except .git)
   git rm -rf .
   
   # Extract the new frontend files
   # (Extract the smart_thermostat_frontend_complete.zip to this directory)
   
   # Add all new files
   git add .
   git commit -m "Update frontend with complete implementation"
   ```

5. **Push changes to GitHub**
   ```bash
   git push origin main
   ```

6. **Verify automatic deployment**
   - Render should automatically detect the changes and start a new deployment
   - Monitor the deployment progress in your Render dashboard
   - Once complete, verify the application at https://smartstatfront.onrender.com

## Troubleshooting

If you encounter any issues during deployment:

1. **Check Render logs**
   - Go to your service in the Render dashboard
   - Click on "Logs" to view build and runtime logs
   - Look for any error messages

2. **CORS issues**
   - Ensure the backend has the correct CORS configuration
   - Verify that `CORS_ALLOWED_ORIGINS` includes your frontend URL

3. **Authentication problems**
   - Clear browser cache and local storage
   - Verify that the API base URL in `src/lib/api.ts` is correct

4. **Build failures**
   - Check for any dependency issues in the logs
   - Try clearing the build cache and redeploying

## Post-Deployment Verification

After successful deployment, verify the following:

1. **Authentication flow**
   - Test user registration
   - Test login functionality
   - Verify that protected routes require authentication

2. **Core features**
   - Dashboard displays correctly
   - Properties management works
   - Thermostat controls function properly
   - Schedules can be created and managed
   - Calendar integrations work as expected
   - Business analysis page loads with all components

3. **Mobile responsiveness**
   - Test the application on various device sizes
   - Verify that the navigation menu works on mobile

## Support

If you need further assistance with deployment or encounter any issues, please contact our support team.
