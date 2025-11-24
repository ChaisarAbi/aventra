# Dokploy Deployment Guide for Porto Portfolio

This guide will help you deploy your Porto portfolio application using Dokploy.

## Prerequisites

- Dokploy installed and running
- Git repository access to your project
- Docker and Docker Compose installed on the Dokploy server

## Deployment Steps

### 1. Prepare Your Repository

Make sure your repository contains:
- `docker-compose.dokploy.yml` (the main deployment file)
- `backend/Dockerfile` (backend service)
- `frontend/Dockerfile` (frontend service)
- `backend/.env.production` (backend environment variables)
- `backend/requirements.txt` (Python dependencies)

### 2. Environment Variables Setup

Create the following environment variables in Dokploy:

**Backend Environment Variables** (in `backend/.env.production`):
```
DATABASE_URL=sqlite:///./portfolio.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend Environment Variables** (set in Dokploy UI):
- `NEXT_PUBLIC_API_URL`: Your backend API URL (e.g., `http://your-domain.com:8001` or `https://api.your-domain.com`)

### 3. Dokploy Deployment Configuration

1. **Create a new application** in Dokploy
2. **Select "Docker Compose"** as the deployment method
3. **Repository URL**: Your Git repository URL
4. **Docker Compose File**: `docker-compose.dokploy.yml`
5. **Environment**: Set the environment variables mentioned above

### 4. Service Configuration

The deployment will create two services:

#### Backend Service
- **Port**: 8001
- **Health Check**: `/health` endpoint
- **Database**: SQLite (persisted via Docker volume)
- **Uploads**: Persisted via Docker volume

#### Frontend Service
- **Port**: 3000
- **Depends on**: Backend service
- **Health Check**: Root endpoint

### 5. Domain Configuration

After deployment, configure your domains:

- **Frontend**: Point your main domain to port 3000
- **Backend API**: Point your API subdomain to port 8001

### 6. SSL/HTTPS Configuration

Use Dokploy's built-in SSL features or configure:
- Let's Encrypt certificates
- Reverse proxy settings

## Important Notes

### Volume Persistence
The application uses Docker volumes to persist:
- Database data (`backend_data`)
- Uploaded files (`backend_uploads`)
- Backup files (`backup_data`)

### Health Checks
- Backend: Checks `/health` endpoint every 30 seconds
- Frontend: Checks root endpoint every 30 seconds
- Services will restart automatically if unhealthy

### Network Configuration
- Services communicate via internal `porto-network`
- External ports are exposed for access

## Troubleshooting

### Common Issues

1. **Backend won't start**:
   - Check if `.env.production` file exists
   - Verify database file permissions
   - Check health endpoint accessibility

2. **Frontend can't connect to backend**:
   - Verify `NEXT_PUBLIC_API_URL` environment variable
   - Check if backend service is healthy
   - Verify network connectivity between services

3. **Uploads not persisting**:
   - Check volume mount permissions
   - Verify Docker volume creation

### Logs Access
Access service logs through Dokploy UI:
- Backend logs: `porto-backend` container
- Frontend logs: `porto-frontend` container

## Backup and Maintenance

### Database Backup
The SQLite database is automatically backed up to the `backup_data` volume. You can access backups at `/app/backup` in the backend container.

### Updates
To update the application:
1. Push changes to your Git repository
2. Redeploy through Dokploy UI
3. Dokploy will rebuild and restart services automatically

## Monitoring

Monitor your deployment through:
- Dokploy application status
- Service health checks
- Application logs
- Resource usage metrics
