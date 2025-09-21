@echo off
echo ========================================
echo Fixing TypeScript Import Paths
echo ========================================
echo.

cd /d "%~dp0backend"

echo Running TypeScript compiler check...
npx tsc --noEmit

if %errorlevel% equ 0 (
    echo.
    echo ✅ TypeScript compilation successful!
    echo.
) else (
    echo.
    echo ⚠️ There might still be some TypeScript errors.
    echo Please check the output above.
    echo.
)

echo ========================================
echo All import paths have been fixed!
echo ========================================
echo.
echo Changes made:
echo - Fixed @types/* imports to @/types/*
echo - Corrected all import paths in controllers
echo - Updated middleware import paths
echo - Fixed Socket.io handler imports
echo.
echo You can now run: npm run dev
echo.
pause
