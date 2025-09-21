# PowerShell script to fix TypeScript issues
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fixing TypeScript Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path "$PSScriptRoot\backend"

Write-Host "Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force

Write-Host "Removing node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Path "node_modules" -Recurse -Force
}

if (Test-Path "package-lock.json") {
    Remove-Item -Path "package-lock.json" -Force
}

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "TypeScript configuration fixed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "You can now run: npm run dev" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to continue..."
