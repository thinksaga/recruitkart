#!/bin/bash

# Recruitkart - Clean Everything Script
# This script removes all build artifacts, dependencies, Docker containers, and database data

set -e

echo "🧹 Cleaning Recruitkart Project..."
echo ""

# Stop any running processes
echo "⏹️  Stopping running processes..."
pkill -f "next dev" || true
pkill -f "prisma studio" || true

# Stop and remove Docker containers
echo "🐳 Stopping Docker containers..."
docker-compose down || true

# Remove Docker containers
echo "🗑️  Removing Docker containers..."
docker rm -f recruitkart_postgres recruitkart_redis recruitkart_minio recruitkart_minio_create_bucket 2>/dev/null || true

# Remove Docker volumes
echo "💾 Removing Docker volumes..."
docker volume rm recruitkart_app_pg_data recruitkart_app_redis_data recruitkart_app_minio_data 2>/dev/null || true
rm -rf docker/pg_data docker/redis_data docker/minio_data

# Remove Docker images (optional - uncomment if you want to remove images too)
# echo "🖼️  Removing Docker images..."
# docker rmi postgres:17-alpine redis:7.4-alpine minio/minio:latest minio/mc 2>/dev/null || true

# Clean Next.js build artifacts
echo "🗑️  Removing Next.js build artifacts..."
rm -rf .next
rm -rf out
rm -rf .turbo

# Clean node modules
echo "📦 Removing node_modules..."
rm -rf node_modules

# Clean package lock
echo "🔒 Removing package-lock.json..."
rm -f package-lock.json

# Clean Prisma generated files
echo "🔧 Removing Prisma generated files..."
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma/client

echo ""
echo "✅ Clean complete!"
echo ""
echo "🔄 What was cleaned:"
echo "  ✓ Next.js build artifacts (.next, out, .turbo)"
echo "  ✓ Node modules and package-lock.json"
echo "  ✓ Prisma generated files"
echo "  ✓ Docker containers (postgres, redis, minio)"
echo "  ✓ Docker volumes (all data deleted)"
echo ""
echo "Next steps:"
echo "  1. Run './scripts/setup.sh' to rebuild everything"
echo "  2. Or run 'npm install' and 'docker-compose up -d' manually"
echo ""
