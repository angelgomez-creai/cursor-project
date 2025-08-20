# ====== /frontend/package-check.bat (Windows) - Utility script ======
@echo off
echo 🔍 E-commerce Frontend Package Health Check...
echo.

REM Check pnpm version
echo 📦 Package Manager:
pnpm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f %%i in ('pnpm --version') do echo   ✅ pnpm: %%i
) else (
    echo   ❌ pnpm: Not installed
)

REM Check Node version  
echo.
echo 🟢 Runtime:
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f %%i in ('node --version') do echo   ✅ Node.js: %%i
) else (
    echo   ❌ Node.js: Not installed
)

REM Check dependencies
echo.
echo 📋 Dependencies Status:
if exist "package.json" (
    echo   ✅ package.json: Found
    
    if exist "pnpm-lock.yaml" (
        echo   ✅ pnpm-lock.yaml: Found
    ) else (
        echo   ⚠️  pnpm-lock.yaml: Not found (run pnpm install)
    )
    
    if exist "node_modules" (
        echo   ✅ node_modules: Found
    ) else (
        echo   ❌ node_modules: Not found (run pnpm install)
    )
) else (
    echo   ❌ package.json: Not found
)

REM Check TypeScript config
echo.
echo 🔧 Configuration:
if exist "tsconfig.json" (
    echo   ✅ TypeScript config: Found
) else (
    echo   ❌ TypeScript config: Not found
)

if exist "vite.config.ts" (
    echo   ✅ Vite config: Found
) else (
    echo   ❌ Vite config: Not found
)

REM Check build files
echo.
echo 🏗️  Build Status:
if exist "dist" (
    echo   ✅ Build directory: Found
) else (
    echo   ℹ️  Build directory: Not found (normal for dev)
)

REM Backend connectivity
echo.
echo 🔗 Backend Connectivity:
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✅ Backend API: Accessible (http://localhost:8000)
) else (
    echo   ❌ Backend API: Not accessible (http://localhost:8000)
)

echo.
echo 📊 Health Check Complete!
pause


