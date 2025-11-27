#!/bin/bash

# Recruitkart - Build for Production Script
# This script builds the project for production deployment

set -e

echo "🏗️  Building Recruitkart for Production..."
echo ""

# Check environment
if [ ! -f .env.local ]; then
    echo "⚠️  Warning: .env.local not found. Make sure environment variables are set."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Build Next.js application
echo "⚙️  Building Next.js application..."
npm run build

echo ""
echo "✅ Build complete!"
echo ""
echo "Production build artifacts:"
echo "  • .next/ - Next.js build output"
echo "  • node_modules/@prisma/client - Prisma Client"
echo ""
echo "To run in production:"
echo "  1. Set DATABASE_URL in production environment"
echo "  2. Run migrations: npx prisma migrate deploy"
echo "  3. Start server: npm start"
echo ""
