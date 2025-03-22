#!/bin/bash

# Script to run both frontend and backend together
echo "Starting the IMS application (frontend + backend)..."

# Make sure backend environment is ready
if [ ! -d ".venv" ]; then
  echo "Virtual environment not found. Creating one..."
  python -m venv .venv
  .venv/bin/pip install -r backend/requirements.txt
else
  echo "Virtual environment found."
fi

# Check if Node modules are installed
if [ ! -d "node_modules" ]; then
  echo "Installing root dependencies..."
  npm install
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "Installing frontend dependencies..."
  cd frontend && npm install && cd ..
fi

# Start the application
echo "Starting backend and frontend..."
npm start 