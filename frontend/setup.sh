# ====== /frontend/setup.sh (Linux/Mac) ======
#!/bin/bash

echo "🎨 Setting up E-commerce Frontend (Legacy Version)..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 pnpm not found, installing pnpm..."
    npm install -g pnpm
    echo "✅ pnpm installed successfully"
else
    echo "✅ pnpm already installed"
fi

# Install dependencies
echo "📥 Installing dependencies with pnpm..."
pnpm install

# Verify installation
echo "🔍 Verifying installation..."
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Error: Dependencies not installed properly"
    exit 1
fi

# Check if backend is running (optional check)
echo "🔗 Checking backend connection..."
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is running and accessible"
else
    echo "⚠️  WARNING: Backend is not running on http://localhost:8000"
    echo "   Make sure to start the backend first!"
fi

echo "🎉 Frontend setup completed successfully!"
echo ""
echo "🚀 To start the development server:"
echo "  pnpm run dev"
echo ""
echo "🌐 Frontend will be available at:"
echo "  http://localhost:3000"
echo ""
echo "🔧 Other available commands:"
echo "  pnpm run build  - Build for production"
echo "  pnpm run lint   - Run ESLint"
echo "  pnpm run preview - Preview production build"
echo ""
echo "⚠️  WARNING: This is legacy code with intentional UI/UX problems!"
echo "📚 Ready for Day 2 refactoring to Feature-Based Architecture!"

# ====================================


