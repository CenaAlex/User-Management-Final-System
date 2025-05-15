#!/bin/bash

# Set legacy-peer-deps before installation
npm config set legacy-peer-deps true

# Explicitly remove any existing node_modules to ensure clean install
if [ -d "Frontend/node_modules" ]; then
  echo "Removing existing node_modules for clean install"
  rm -rf Frontend/node_modules
fi

# Install all dependencies with legacy-peer-deps flag
npm install --legacy-peer-deps && npm run build 
