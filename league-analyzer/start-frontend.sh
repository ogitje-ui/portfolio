#!/bin/bash
# Start the League Analyzer Frontend

echo "================================="
echo "LoL Performance Analyzer Frontend"
echo "================================="

cd "$(dirname "$0")/frontend"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the development server
echo "Starting React development server on port 3000..."
npm start
