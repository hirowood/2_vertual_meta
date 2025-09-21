@echo off
echo ====================================
echo バーチャルスクール開発サーバー起動
echo ====================================
echo.

:: バックエンドを起動
echo [1/2] バックエンドサーバーを起動しています...
cd backend
start cmd /k "npm run dev"
timeout /t 3 >nul

:: フロントエンドを起動
echo [2/2] フロントエンドサーバーを起動しています...
cd ..\frontend
start cmd /k "npm run dev"
timeout /t 3 >nul

echo.
echo ====================================
echo 起動完了！
echo ====================================
echo.
echo フロントエンド: http://localhost:3000
echo バックエンド: http://localhost:5000
echo.
echo 終了するには各ウィンドウでCtrl+Cを押してください
echo.
pause
