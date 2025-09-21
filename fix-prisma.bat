@echo off
echo ========================================
echo Fixing Prisma Schema for SQLite
echo ========================================
echo.

cd /d "%~dp0backend"

echo Generating Prisma Client...
call npx prisma generate

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to generate Prisma Client
    pause
    exit /b 1
)

echo.
echo Pushing database schema...
call npx prisma db push --accept-data-loss

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to push database schema
    pause
    exit /b 1
)

echo.
echo ========================================
echo Database setup complete!
echo ========================================
echo.
echo The following changes were made:
echo - Converted Enums to String fields (SQLite compatibility)
echo - Removed @db.Date annotations (SQLite compatibility)
echo.
echo You can now run: npm run dev
echo.
pause
