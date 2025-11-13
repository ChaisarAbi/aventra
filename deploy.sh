#!/bin/bash

# Aventra Portfolio Deployment Script
# This script automates the deployment process to your VPS

set -e  # Exit on any error

echo "🚀 Starting Aventra Portfolio Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_warning "Please run as root or with sudo for full deployment"
fi

# Check Docker installation
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p data/nginx-proxy-manager
mkdir -p data/letsencrypt
mkdir -p backup

# Stop existing services if running
print_status "Stopping existing services..."
docker-compose down 2>/dev/null || true

# Build and start services
print_status "Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 10

# Check if services are running
print_status "Checking service status..."
if docker-compose ps | grep -q "Up"; then
    print_status "✅ All services are running successfully!"
else
    print_error "❌ Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi

# Display deployment information
echo ""
print_status "🎉 Deployment Completed Successfully!"
echo ""
echo "📊 Service Information:"
echo "   Frontend: http://localhost:3501 (or your domain)"
echo "   Backend API: http://localhost:8001"
echo "   API Documentation: http://localhost:8001/docs"
echo "   Admin Panel: http://your-domain/admin/login"
echo ""
echo "🔧 Management Commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo "   Update services: docker-compose pull && docker-compose up -d"
echo ""
echo "📝 Next Steps:"
echo "   1. Configure Nginx Proxy Manager for your domain"
echo "   2. Setup SSL certificates"
echo "   3. Update environment variables for production"
echo "   4. Add sample data (optional): docker-compose exec backend python create_sample_data.py"
echo ""

# Check if we can add sample data
read -p "Do you want to add sample data now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Adding sample data..."
    docker-compose exec backend python create_sample_data.py
    print_status "✅ Sample data added successfully!"
fi

print_status "Deployment script completed!"
