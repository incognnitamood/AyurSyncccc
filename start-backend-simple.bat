@echo off
title AyurSync Backend Server
echo.
echo ========================================
echo    AyurSync Backend Server
echo ========================================
echo.

cd /d "%~dp0backend"

echo Installing dependencies...
call npm install

echo.
echo Starting backend server...
echo.
echo IMPORTANT: Keep this window open!
echo Backend will be available at: http://localhost:5000
echo.

node simple-server.js

echo.
echo Backend server stopped. Press any key to exit...
pause >nul
