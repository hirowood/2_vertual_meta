@echo off
echo ========================================
echo Final TypeScript Check
echo ========================================
echo.

cd /d "%~dp0backend"

echo Installing any missing packages...
npm install

echo.
echo Generating Prisma Client...
call npx prisma generate

echo.
echo Compiling TypeScript...
call npx tsc --noEmit

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✅ All TypeScript errors resolved!
    echo ========================================
    echo.
    echo Backend is ready to run!
    echo.
    echo To start the development server:
    echo   cd backend
    echo   npm run dev
    echo.
) else (
    echo.
    echo ========================================
    echo ⚠️ TypeScript compilation warnings/errors
    echo ========================================
    echo.
    echo Please check the output above for details.
    echo Most warnings can be safely ignored for development.
    echo.
)

pause
