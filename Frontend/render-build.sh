#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Installing dependencies..."
npm install

echo "Building the Angular application..."
npm run build

echo "Creating _redirects file in the dist folder..."
echo "/* /index.html 200" > dist/user-management-system/_redirects

echo "Build completed successfully!" 