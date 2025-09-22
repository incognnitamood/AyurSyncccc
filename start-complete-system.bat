@echo off
title AyurSync Complete System Startup
color 0A

echo.
echo ========================================
echo     AyurSync Complete System Startup
echo ========================================
echo.
echo Starting production-ready Ayurvedic Diet Management System...
echo.

echo [1/3] Killing any existing node processes...
taskkill /f /im node.exe >nul 2>&1

echo [2/3] Starting backend server on port 3001...
cd /d "C:\Users\sujat\OneDrive\Desktop\AyurSyncccc\backend"
start "AyurSync Backend" cmd /k "echo AyurSync Backend Server & echo. & node server-supabase.js"

echo [3/3] Starting frontend development server...
cd /d "C:\Users\sujat\OneDrive\Desktop\AyurSyncccc\frontend"
timeout /t 3 >nul
start "AyurSync Frontend" cmd /k "echo AyurSync Frontend & echo. & npm run dev"

echo.
echo ========================================
echo      System Starting Successfully!
echo ========================================
echo.
echo Backend Server: http://localhost:3001
echo Frontend URL: http://localhost:5173 (or next available)
echo Health Check: http://localhost:3001/health
echo.
echo Demo Login Credentials:
echo Email: demo@ayursync.com
echo Password: demo123
echo.
echo Features Available:
echo - Patient Management (Unlimited Inputs)
echo - AI Diet Plan Generator (Unlimited Preferences)
echo - PDF Report Generation
echo - 50+ Ayurvedic Recipes
echo - Real-time Database Sync
echo.
echo The system will open automatically in a few seconds...
echo.

timeout /t 5 >nul
start http://localhost:5173

echo System startup complete!
echo Press any key to close this window...
pause >nul