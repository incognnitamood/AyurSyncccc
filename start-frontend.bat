@echo off
echo Starting AyurSync Frontend...
echo.

echo Installing frontend dependencies...
call npm install

echo.
echo Starting frontend development server...
echo Frontend will be available at: http://localhost:5173
echo.

npm run dev

pause
