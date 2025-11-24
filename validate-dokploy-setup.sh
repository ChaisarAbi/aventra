#!/bin/bash

echo "🔍 Validating Dokploy Deployment Setup..."

# Check if required files exist
echo "📁 Checking required files..."
required_files=(
  "docker-compose.dokploy.yml"
  "backend/Dockerfile"
  "frontend/Dockerfile"
  "backend/requirements.txt"
  "backend/.env.production"
)

for file in "${required_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ $file is missing"
    exit 1
  fi
done

# Validate Docker Compose syntax
echo "🐳 Validating Docker Compose syntax..."
if docker-compose -f docker-compose.dokploy.yml config > /dev/null 2>&1; then
  echo "✅ Docker Compose syntax is valid"
else
  echo "❌ Docker Compose syntax is invalid"
  exit 1
fi

# Check backend environment variables
echo "🔧 Checking backend environment variables..."
if grep -q "DATABASE_URL" backend/.env.production && \
   grep -q "SECRET_KEY" backend/.env.production; then
  echo "✅ Backend environment variables are set"
else
  echo "⚠️  Some backend environment variables may be missing"
fi

# Check frontend build configuration
echo "⚛️  Checking frontend configuration..."
if [ -f "frontend/next.config.js" ]; then
  echo "✅ Next.js configuration exists"
else
  echo "❌ Next.js configuration missing"
fi

echo ""
echo "🎉 Setup validation complete!"
echo ""
echo "📋 Next steps for Dokploy deployment:"
echo "1. Push these files to your Git repository"
echo "2. Create a new application in Dokploy"
echo "3. Select 'Docker Compose' deployment method"
echo "4. Use 'docker-compose.dokploy.yml' as the compose file"
echo "5. Set environment variables in Dokploy UI"
echo "6. Deploy and monitor the application"
echo ""
echo "📚 See DOKPLOY-DEPLOYMENT.md for detailed instructions"
