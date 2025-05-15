#!/bin/bash

# Exit on error
set -e

echo "==> Starting deployment build process..."

# Set legacy-peer-deps before installation globally
echo "==> Setting legacy-peer-deps configuration..."
npm config set legacy-peer-deps true

# Go to Frontend directory
cd Frontend

# Clean npm cache
echo "==> Cleaning npm cache..."
npm cache clean --force

# Remove existing node_modules and lock files to ensure a clean install
echo "==> Removing existing node_modules and lock files for clean install..."
if [ -d "node_modules" ]; then
  rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
  rm -f package-lock.json
fi

# Install with specific versions for problematic packages
echo "==> Installing dependencies with legacy-peer-deps..."
npm install --legacy-peer-deps

# Build the Angular application
echo "==> Building Angular application..."
npm run build

echo "==> Build process completed successfully!" 
