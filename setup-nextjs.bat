@echo off
echo ==================================
echo Setting up Next.js Frontend
echo ==================================

cd frontend

echo.
echo Installing Next.js and dependencies...
call npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git

echo.
echo Installing additional dependencies...
call npm install @prisma/client socket.io-client phaser zustand axios react-hook-form zod @hookform/resolvers

echo.
echo Installing development dependencies...
call npm install -D @types/node

echo.
echo Setup complete!
pause
