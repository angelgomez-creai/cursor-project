# ====== /frontend/start.sh (Linux/Mac) ======
#!/bin/bash

echo "🚀 Starting E-commerce Frontend (Legacy Version)..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Dependencies not found!"
    echo "🔧 Please run setup.sh first"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found!"
    echo "🔧 Please run setup.sh first to install pnpm"
    exit 1
fi

# Check backend connection (optional)
echo "🔗 Checking backend connection..."
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is running and accessible"
else
    echo "⚠️  WARNING: Backend not detected on http://localhost:8000"
    echo "   Frontend will work but API calls will fail"
    echo "   Start backend first: cd ../backend && python main.py"
fi

# Start the development server
echo "🌟 Starting Vite development server..."
echo "🌐 Frontend will be available at: http://localhost:3000"
echo "🔄 Hot reload enabled for development"
echo ""
echo "⚠️  WARNING: This frontend contains intentional problems!"
echo "🎯 Ready for Feature-Based Architecture refactoring!"
echo ""
echo "Press Ctrl+C to stop the server"

pnpm run dev

# ====================================


