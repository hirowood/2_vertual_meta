@echo off
echo ==================================
echo Installing Frontend Dependencies
echo ==================================

cd frontend

echo.
echo Installing npm packages...
call npm install

echo.
echo Installation complete!

cd ..

echo.
echo ==================================
echo Frontend Setup Complete!
echo ==================================
echo.
echo To start development:
echo   1. Run "npm run dev" in the frontend folder
echo   2. Run "npm run dev" in the backend folder
echo.
pause
