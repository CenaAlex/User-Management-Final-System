# Deployment Guide for User Management System

This guide explains how to deploy the User Management System on Render.com.

## Prerequisites

- A Render.com account
- A GitHub account (for connecting your repository to Render)
- Your MySQL database credentials

## Backend Deployment Steps

1. **Push your code to GitHub**
   - Create a new GitHub repository
   - Push your code to the repository

2. **Create a new Web Service on Render**
   - Log in to your Render account
   - Click on "New +" and select "Web Service"
   - Connect your GitHub repository
   - Use the following settings:
     - **Name**: user-management-backend
     - **Environment**: Node
     - **Build Command**: `cd Backend && npm install`
     - **Start Command**: `cd Backend && npm start`
     - **Plan**: Choose the appropriate plan (Free tier works for testing)

3. **Set Environment Variables**
   - In your Render dashboard, go to your web service
   - Click on "Environment" tab
   - Add the following environment variables:
     - `NODE_ENV`: `production`
     - `PORT`: `10000`

4. **Deploy the Service**
   - Click on "Manual Deploy" and select "Deploy latest commit"
   - Wait for the deployment to complete

5. **Verify the Deployment**
   - Once deployed, click on the URL provided by Render
   - You should see a message: "User Management API is running"
   - Test the API endpoints using tools like Postman

## Frontend Deployment Steps

1. **Create a new Static Site on Render**
   - Log in to your Render account
   - Click on "New +" and select "Static Site"
   - Connect your GitHub repository
   - Use the following settings:
     - **Name**: user-management-frontend
     - **Build Command**: `cd Frontend && npm install && npm run build`
     - **Publish Directory**: `Frontend/dist/user-management-system`
     - **Plan**: Choose the appropriate plan (Free tier works for testing)

2. **Set Environment Variables (if needed)**
   - In your Render dashboard, go to your static site
   - Click on "Environment" tab
   - Add any necessary environment variables

3. **Deploy the Static Site**
   - Click on "Manual Deploy" and select "Deploy latest commit"
   - Wait for the deployment to complete

4. **Verify the Frontend Deployment**
   - Once deployed, click on the URL provided by Render
   - You should see your User Management System frontend
   - Test the login and other features

## Alternative: Using render.yaml for Deployment

If you prefer to use the `render.yaml` file for deployment:

1. **Create a Blueprint on Render**
   - Log in to your Render account
   - Click on "New +" and select "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file and create the services

2. **Verify the Deployments**
   - Once deployed, check both the backend and frontend URLs
   - Test the application functionality

## Troubleshooting

- **Database Connection Issues**: 
  - Ensure your MySQL credentials are correct in the config.json file
  - Check if your MySQL server allows remote connections
  - Verify that the necessary database tables are created

- **Deployment Failures**:
  - Check the logs in your Render dashboard
  - Ensure all dependencies are correctly listed in package.json
  - Verify that the build and start commands are correct

- **CORS Issues**:
  - If you encounter CORS errors, ensure the backend is properly configured to allow requests from the frontend domain
  - You may need to update the CORS configuration in the backend's server.js file

- **Frontend-Backend Connection**:
  - Make sure the frontend's environment.prod.ts file has the correct backend URL
  - Test the API endpoints directly to ensure they're accessible 