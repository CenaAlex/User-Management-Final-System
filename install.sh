#!/bin/bash

# Exit on error
set -e

echo "==> Starting deployment build process..."

# Set legacy-peer-deps before installation globally
echo "==> Setting legacy-peer-deps configuration..."
npm config set legacy-peer-deps true

# Debug: Show current npm configuration
echo "==> Current npm configuration:"
npm config list

# Go to Frontend directory
cd Frontend

# Print current directory
echo "==> Current working directory: $(pwd)"

# List files to debug
echo "==> Listing package.json content:"
cat package.json

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

# Install with production flag to skip devDependencies
echo "==> Installing dependencies with --legacy-peer-deps and --production=false..."
npm install --legacy-peer-deps --production=false --no-optional

# Debug: Check what was installed
echo "==> Installed packages:"
npm list --depth=0

# Build the Angular application
echo "==> Building Angular application..."
npm run build

echo "==> Build process completed successfully!" 
