@echo off
echo Starting Backend Server...
cd /d "%~dp0backend"
start "Backend Server" cmd /k "npm run dev"

timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
cd /d "%~dp0frontend"
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo Servers are starting...
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul
