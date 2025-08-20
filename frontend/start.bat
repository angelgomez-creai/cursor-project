# ====== /frontend/start.bat (Windows) ======
@echo off
echo 🚀 Starting E-commerce Frontend (Legacy Version)...

REM Check if node_modules exists
if not exist "node_modules" (
    echo ❌ Dependencies not found!
    echo 🔧 Please run setup.bat first
    pause
    exit /b 1
)

REM Check if pnpm is installed
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ pnpm not found!
    echo 🔧 Please run setup.bat first to install pnpm
    pause
    exit /b 1
)

REM Check backend connection (optional)
echo 🔗 Checking backend connection...
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is running and accessible
) else (
    echo ⚠️  WARNING: Backend not detected on http://localhost:8000
    echo    Frontend will work but API calls will fail
    echo    Start backend first: cd ../backend ^&^& python main.py
)

REM Start the development server
echo 🌟 Starting Vite development server...
echo 🌐 Frontend will be available at: http://localhost:3000
echo 🔄 Hot reload enabled for development
echo.
echo ⚠️  WARNING: This frontend contains intentional problems!
echo 🎯 Ready for Feature-Based Architecture refactoring!
echo.
echo Press Ctrl+C to stop the server

pnpm run dev

# ====================================


