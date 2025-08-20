# ====== /frontend/package-check.sh (Linux/Mac) - Utility script ======
#!/bin/bash

echo "🔍 E-commerce Frontend Package Health Check..."
echo ""

# Check pnpm version
echo "📦 Package Manager:"
if command -v pnpm &> /dev/null; then
    echo "  ✅ pnpm: $(pnpm --version)"
else
    echo "  ❌ pnpm: Not installed"
fi

# Check Node version
echo ""
echo "🟢 Runtime:"
if command -v node &> /dev/null; then
    echo "  ✅ Node.js: $(node --version)"
else
    echo "  ❌ Node.js: Not installed"
fi

# Check dependencies
echo ""
echo "📋 Dependencies Status:"
if [ -f "package.json" ]; then
    echo "  ✅ package.json: Found"
    
    if [ -f "pnpm-lock.yaml" ]; then
        echo "  ✅ pnpm-lock.yaml: Found"
    else
        echo "  ⚠️  pnpm-lock.yaml: Not found (run pnpm install)"
    fi
    
    if [ -d "node_modules" ]; then
        echo "  ✅ node_modules: Found"
        
        # Count installed packages
        package_count=$(find node_modules -name "package.json" -not -path "*/node_modules/*" | wc -l)
        echo "  📊 Installed packages: $package_count"
    else
        echo "  ❌ node_modules: Not found (run pnpm install)"
    fi
else
    echo "  ❌ package.json: Not found"
fi

# Check TypeScript config
echo ""
echo "🔧 Configuration:"
if [ -f "tsconfig.json" ]; then
    echo "  ✅ TypeScript config: Found"
else
    echo "  ❌ TypeScript config: Not found"
fi

if [ -f "vite.config.ts" ]; then
    echo "  ✅ Vite config: Found"
else
    echo "  ❌ Vite config: Not found"
fi

# Check build files
echo ""
echo "🏗️  Build Status:"
if [ -d "dist" ]; then
    echo "  ✅ Build directory: Found"
else
    echo "  ℹ️  Build directory: Not found (normal for dev)"
fi

# Check ports
echo ""
echo "🌐 Port Status:"
if command -v netstat &> /dev/null; then
    if netstat -an | grep -q ":3000"; then
        echo "  ⚠️  Port 3000: In use"
    else
        echo "  ✅ Port 3000: Available"
    fi
fi

# Backend connectivity
echo ""
echo "🔗 Backend Connectivity:"
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "  ✅ Backend API: Accessible (http://localhost:8000)"
else
    echo "  ❌ Backend API: Not accessible (http://localhost:8000)"
fi

echo ""
echo "📊 Health Check Complete!"

# ====================================


