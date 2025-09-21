@echo off
echo ==================================
echo Starting Development Servers
echo ==================================

echo Starting Backend Server...
start cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo ==================================
echo Development servers are starting...
echo ==================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window (servers will continue running)...
pause > nul
