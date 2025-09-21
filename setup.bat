@echo off
echo ====================================
echo バーチャルスクール - 初期セットアップ
echo ====================================
echo.

:: バックエンドの依存関係をインストール
echo [1/4] バックエンドの依存関係をインストールしています...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo バックエンドのインストールに失敗しました
    pause
    exit /b 1
)

:: Prismaのセットアップ
echo [2/4] データベースを設定しています...
call npx prisma generate
call npx prisma db push
if %errorlevel% neq 0 (
    echo データベースの設定に失敗しました
    pause
    exit /b 1
)

:: フロントエンドの依存関係をインストール
echo [3/4] フロントエンドの依存関係をインストールしています...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo フロントエンドのインストールに失敗しました
    pause
    exit /b 1
)

:: 追加パッケージのインストール
echo [4/4] 追加パッケージをインストールしています...
call npm install clsx tailwind-merge
if %errorlevel% neq 0 (
    echo 追加パッケージのインストールに失敗しました
    pause
    exit /b 1
)

cd ..

echo.
echo ====================================
echo セットアップ完了！
echo ====================================
echo.
echo 次のコマンドで開発サーバーを起動できます:
echo   start-dev.bat
echo.
pause
