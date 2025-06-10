#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Define project root
PROJECT_ROOT=$(pwd)

# Backend setup
echo "Setting up backend..."
cd "$PROJECT_ROOT/backend"

# Check if node_modules exists, if not run npm install
if [ ! -d "node_modules" ]; then
  echo "Installing backend dependencies..."
  npm install
else
  echo "Backend dependencies already installed."
fi

# Frontend setup
echo "Setting up frontend..."
cd "$PROJECT_ROOT/frontend"

# Check if node_modules exists, if not run npm install
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
else
  echo "Frontend dependencies already installed."
fi

# Build frontend
echo "Building frontend..."
npm run build

# Navigate back to project root then to backend to start server
cd "$PROJECT_ROOT/backend"

# Start the backend server (which will serve the frontend)
# The backend server should be configured to serve static files from ../frontend/dist
# and listen on port 9000.
echo "Starting backend server on port 9000..."
PORT=9000 npm start

echo "Application should be running on http://localhost:9000"