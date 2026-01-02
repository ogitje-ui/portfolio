#!/bin/bash
# Start the League Analyzer Backend

echo "================================"
echo "LoL Performance Analyzer Backend"
echo "================================"

cd "$(dirname "$0")/backend"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Start the server
echo "Starting Flask server on port 5000..."
python app.py
