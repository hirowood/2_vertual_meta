@echo off
echo ========================================
echo Installing TypeScript and Node.js types
echo ========================================
echo.

cd /d "%~dp0backend"

echo Installing @types/node and other dependencies...
npm install --save-dev @types/node@20.10.5
npm install --save-dev typescript@5.3.3
npm install --save-dev ts-node@10.9.2
npm install --save-dev tsconfig-paths@4.2.0

echo.
echo Installing production dependencies...
npm install dotenv@16.3.1
npm install express@4.18.2
npm install @prisma/client@5.7.0

echo.
echo Generating Prisma Client...
npx prisma generate

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo TypeScript configuration has been fixed.
echo You can now run: npm run dev
echo.
pause
