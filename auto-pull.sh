#!/bin/bash

# Script untuk auto-pull dari GitHub di VPS
# Simpan di ~/aventra/auto-pull.sh dan jalankan dengan cron

echo "🚀 Starting auto-pull from GitHub..."

# Navigate to project directory
cd ~/aventra

# Check if there are any changes in remote
echo "🔍 Checking for remote changes..."
git fetch origin

# Compare local and remote
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ $LOCAL = $REMOTE ]; then
    echo "✅ Repository is up to date. No changes to pull."
else
    echo "🔄 New changes detected. Pulling from GitHub..."
    
    # Pull the latest changes
    git pull origin main
    
    echo "📦 Rebuilding and restarting services..."
    # Stop existing services
    docker-compose down
    
    # Rebuild and start services
    docker-compose up -d --build
    
    echo "✅ Auto-pull and deployment completed successfully!"
fi
