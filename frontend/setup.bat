# ====== /frontend/setup.bat (Windows) ======
@echo off
echo 🎨 Setting up E-commerce Frontend (Legacy Version)...

REM Check if pnpm is installed
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 pnpm not found, installing pnpm...
    npm install -g pnpm
    if %errorlevel% neq 0 (
        echo ❌ Error installing pnpm
        pause
        exit /b 1
    )
    echo ✅ pnpm installed successfully
) else (
    echo ✅ pnpm already installed
)

REM Install dependencies
echo 📥 Installing dependencies with pnpm...
pnpm install
if %errorlevel% neq 0 (
    echo ❌ Error installing dependencies
    pause
    exit /b 1
)

REM Verify installation
echo 🔍 Verifying installation...
if exist "node_modules" (
    echo ✅ Dependencies installed successfully
) else (
    echo ❌ Error: Dependencies not installed properly
    pause
    exit /b 1
)

REM Check if backend is running (optional check)
echo 🔗 Checking backend connection...
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is running and accessible
) else (
    echo ⚠️  WARNING: Backend is not running on http://localhost:8000
    echo    Make sure to start the backend first!
)

echo 🎉 Frontend setup completed successfully!
echo.
echo 🚀 To start the development server:
echo   pnpm run dev
echo.
echo 🌐 Frontend will be available at:
echo   http://localhost:3000
echo.
echo 🔧 Other available commands:
echo   pnpm run build  - Build for production
echo   pnpm run lint   - Run ESLint  
echo   pnpm run preview - Preview production build
echo.
echo ⚠️  WARNING: This is legacy code with intentional UI/UX problems!
echo 📚 Ready for Day 2 refactoring to Feature-Based Architecture!
pause

# ====================================


