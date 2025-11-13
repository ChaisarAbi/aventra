# Deployment Guide - Aventra Portfolio

This guide covers how to deploy the Aventra Portfolio website using Docker and Nginx Proxy Manager.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Domain name pointed to your server (e.g., `aventra.my.id`)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd aventra-portfolio
```

### 2. Configure Environment
Update the backend environment file:
```bash
# Edit backend/.env
ADMIN_USERNAME=aventra
ADMIN_PASSWORD=your_secure_password_here
JWT_SECRET_KEY=your_jwt_secret_key_here
DATABASE_URL=sqlite:///./portfolio.db
```

### 3. Deploy with Docker
```bash
docker-compose up -d
```

### 4. Add Sample Data (Optional)
```bash
# Make sure backend is running first
cd backend
python create_sample_data.py
```

## 🌐 Nginx Proxy Manager Setup

### 1. Install Nginx Proxy Manager
```yaml
# docker-compose.yml for NPM
version: '3.9'
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '443:443'
      - '81:81'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

### 2. Configure Proxy Hosts

#### Frontend (aventra.my.id)
- Domain Names: `aventra.my.id`, `www.aventra.my.id`
- Forward Hostname/IP: `frontend` (or your server IP)
- Forward Port: `3501`
- SSL: Enable, use Let's Encrypt

#### Backend API (api.aventra.my.id)
- Domain Names: `api.aventra.my.id`
- Forward Hostname/IP: `backend` (or your server IP)
- Forward Port: `8001`
- SSL: Enable, use Let's Encrypt

### 3. Update Frontend API URL
Update the frontend environment variable in `docker-compose.yml`:
```yaml
environment:
  - NEXT_PUBLIC_API_URL=https://api.aventra.my.id
```

## 🔧 Manual Deployment (Without Docker)

### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --host 0.0.0.0 --port 8001
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

## 📊 Monitoring & Logs

### Docker Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Health Checks
- Frontend: `http://localhost:3501` or your domain
- Backend API: `http://localhost:8001/health`
- API Documentation: `http://localhost:8001/docs`

## 🔒 Security Considerations

### 1. Environment Variables
- Change default admin credentials
- Use strong JWT secret key
- Consider using environment-specific database URLs

### 2. SSL/TLS
- Always enable SSL in production
- Use Let's Encrypt for free certificates
- Configure HTTPS redirect

### 3. Database
- For production, consider using PostgreSQL instead of SQLite
- Regular backups recommended
- Environment-specific database configurations

## 🛠️ Development

### Local Development
```bash
# Backend (port 8001)
cd backend && uvicorn main:app --reload --port 8001

# Frontend (port 3501)
cd frontend && npm run dev -- --port 3501
```

### Admin Access
- URL: `/admin/login`
- Default credentials (change in production):
  - Username: `aventra`
  - Password: `Leaveempty1!`

## 📈 Performance Optimization

### Frontend
- Images are optimized with Next.js
- Code splitting enabled
- Static generation where possible

### Backend
- FastAPI with async support
- SQLModel for efficient database operations
- CORS configured for frontend domains

## 🔄 Updates & Maintenance

### Update Application
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Database Backup
```bash
# Backup SQLite database
cp backend/portfolio.db backup/portfolio-$(date +%Y%m%d).db
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**
   - Check if ports 3501 and 8001 are available
   - Update ports in docker-compose.yml if needed

2. **Database issues**
   - Delete `backend/portfolio.db` to reset
   - Run sample data script again

3. **CORS errors**
   - Ensure frontend URL is in backend CORS configuration
   - Check API URL in frontend environment variables

4. **Admin login issues**
   - Verify environment variables are set correctly
   - Check backend logs for authentication errors

### Log Locations
- Docker logs: `docker-compose logs`
- Backend logs: Console output or Docker logs
- Frontend logs: Browser console and Docker logs

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review application logs
3. Check API documentation at `/docs`
4. Verify environment configuration

---

**Note**: This deployment guide assumes basic knowledge of Docker, domain management, and server administration. Adjust configurations based on your specific hosting environment.
