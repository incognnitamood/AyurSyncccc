@echo off
echo Starting AyurSync Backend Server...
echo.

cd backend

echo Installing backend dependencies...
call npm install

echo.
echo Starting backend server...
echo Backend will be available at: http://localhost:5000
echo.

node test-server.js

pause
