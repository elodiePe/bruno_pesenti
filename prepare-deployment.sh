#!/bin/bash

# Bruno Pesenti - Pre-deployment Checklist
# Run this script before deploying to production

echo "🔍 Checking deployment readiness...\n"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗${NC} Node.js is not installed"
    exit 1
fi
echo -e "${GREEN}✓${NC} Node.js $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗${NC} npm is not installed"
    exit 1
fi
echo -e "${GREEN}✓${NC} npm $(npm --version)"

# Check .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠${NC} .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo -e "${YELLOW}⚠${NC} Please update .env with your production values"
fi
echo -e "${GREEN}✓${NC} .env file exists"

# Check package.json
if [ ! -f package.json ]; then
    echo -e "${RED}✗${NC} package.json not found at root"
    exit 1
fi
echo -e "${GREEN}✓${NC} package.json exists"

# Check server/package.json
if [ ! -f server/package.json ]; then
    echo -e "${RED}✗${NC} server/package.json not found"
    exit 1
fi
echo -e "${GREEN}✓${NC} server/package.json exists"

# Check node_modules
if [ ! -d node_modules ]; then
    echo -e "${YELLOW}⚠${NC} Installing root dependencies..."
    npm install
fi
echo -e "${GREEN}✓${NC} Frontend dependencies installed"

# Check server node_modules
if [ ! -d server/node_modules ]; then
    echo -e "${YELLOW}⚠${NC} Installing backend dependencies..."
    cd server && npm install && cd ..
fi
echo -e "${GREEN}✓${NC} Backend dependencies installed"

# Check for required environment variables
echo -e "\n🔐 Checking environment variables..."

if grep -q "MONGODB_URI=" .env && [ "$(grep MONGODB_URI .env | grep -v '#')" != "" ]; then
    echo -e "${GREEN}✓${NC} MONGODB_URI configured"
else
    echo -e "${RED}✗${NC} MONGODB_URI not configured in .env"
fi

if grep -q "VITE_API_URL=" .env && [ "$(grep VITE_API_URL .env | grep -v '#')" != "" ]; then
    echo -e "${GREEN}✓${NC} VITE_API_URL configured"
else
    echo -e "${RED}✗${NC} VITE_API_URL not configured in .env"
fi

# Build frontend
echo -e "\n🏗️  Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Frontend build successful"
else
    echo -e "${RED}✗${NC} Frontend build failed"
    exit 1
fi

# Check if dist folder exists
if [ -d dist ]; then
    echo -e "${GREEN}✓${NC} dist folder created"
else
    echo -e "${RED}✗${NC} dist folder not found"
    exit 1
fi

echo -e "\n✅ All checks passed! Ready for deployment.\n"
echo -e "Next steps:"
echo -e "1. Verify your .env file has correct production values"
echo -e "2. Choose your deployment platform (Vercel, Render, VPS, etc.)"
echo -e "3. Follow DEPLOYMENT_GUIDE.md for your chosen platform"
