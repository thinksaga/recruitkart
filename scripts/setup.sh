#!/bin/bash

# Recruitkart - Setup and Run Script
# This script sets up the entire project from scratch

set -e

echo "🚀 Setting up Recruitkart..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating from .env..."
    cp .env .env.local
    echo "✅ Created .env.local"
fi

# Start Docker services
echo "🐳 Starting Docker services (PostgreSQL, Redis, MinIO)..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/recruitkart?schema=public" npx prisma generate

# Run migrations
echo "🗄️  Running database migrations..."
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/recruitkart?schema=public" npx prisma migrate deploy

# Seed database with test data
echo "🌱 Seeding database with test data..."
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/recruitkart?schema=public" npx tsx scripts/seed.ts

# Create admin users
echo "👤 Creating Recruitkart staff users..."
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/recruitkart?schema=public" npx tsx scripts/create-admin.ts

echo ""
echo "✅ Setup complete!"
echo ""
echo "🔐 Credentials Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Recruitkart Staff:"
echo "  • admin@recruitkart.com / admin@recruitkart2024 (ADMIN)"
echo "  • support@recruitkart.com / support@recruitkart2024 (SUPPORT)"
echo "  • operator@recruitkart.com / operator@recruitkart2024 (OPERATOR)"
echo ""
echo "Test Users:"
echo "  • admin@test.com / password123 (Company Admin)"
echo "  • tas1@test.com / password123 (TAS, Verified)"
echo "  • tas2@test.com / password123 (TAS, Pending)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Starting development server..."
echo ""

# Start development server
npm run dev
