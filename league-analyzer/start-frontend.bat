@echo off
REM Start the League Analyzer Frontend

echo =================================
echo LoL Performance Analyzer Frontend
echo =================================

cd /d "%~dp0frontend"

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Start the development server
echo Starting React development server on port 3000...
npm start

pause
