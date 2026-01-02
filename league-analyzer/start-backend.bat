@echo off
REM Start the League Analyzer Backend

echo ================================
echo LoL Performance Analyzer Backend
echo ================================

cd /d "%~dp0backend"

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Start the server
echo Starting Flask server on port 5000...
python app.py

pause
