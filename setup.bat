@echo off
echo ========================================
echo Virtual School Platform Setup
echo ========================================
echo.

REM Check Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Installing backend dependencies...
cd /d "%~dp0backend"
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Setting up database...
call npx prisma generate
call npx prisma db push
if %errorlevel% neq 0 (
    echo [ERROR] Failed to setup database
    pause
    exit /b 1
)

echo.
echo [3/4] Installing frontend dependencies...
cd /d "%~dp0frontend"
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo To run the application:
echo.
echo 1. Start the backend server:
echo    cd backend
echo    npm run dev
echo.
echo 2. In a new terminal, start the frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 3. Access the application at:
echo    http://localhost:3000
echo.
echo ========================================
pause
