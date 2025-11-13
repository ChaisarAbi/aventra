# 🚀 Panduan Deployment Aventra Portfolio ke VPS

Panduan lengkap untuk mendeploy website portofolio Aventra ke VPS Ubuntu 24.04.

## 📋 Prasyarat

### VPS Requirements
- **OS**: Ubuntu 24.04 LTS
- **RAM**: Minimal 2GB
- **Storage**: Minimal 20GB
- **Ports**: 22 (SSH), 80 (HTTP), 443 (HTTPS), 81 (NPM Admin)

### Software yang Diperlukan
- Docker & Docker Compose
- Domain: `aventra.my.id` (sudah di-point ke IP VPS)

## 🛠️ Persiapan VPS

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Docker & Docker Compose
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Reboot untuk apply changes
sudo reboot
```

### 3. Clone Project
```bash
# Clone dari repository Git Anda
git clone <your-repository-url>
cd aventra-portfolio

# Atau upload manual via SCP/SFTP
```

## ⚙️ Konfigurasi Environment

### 1. Update Environment Variables
Edit file `backend/.env.production`:

```env
# Production Environment Variables
ADMIN_USERNAME=aventra
ADMIN_PASSWORD=password_production_yang_kuat
JWT_SECRET_KEY=jwt_secret_key_yang_sangat_aman_ubah_ini
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60
DATABASE_URL=sqlite:///./portfolio.db
CORS_ORIGINS=["https://aventra.my.id","https://www.aventra.my.id"]
HOST=0.0.0.0
PORT=8001
LOG_LEVEL=INFO
CONTACT_EMAIL=abi@aventra.my.id
```

### 2. Buat Direktori Data
```bash
mkdir -p data/nginx-proxy-manager
mkdir -p data/letsencrypt
mkdir -p data/uptime-kuma
mkdir -p backup
```

## 🚀 Deployment Otomatis

### Gunakan Script Deployment
```bash
# Berikan permission execute
chmod +x deploy.sh

# Jalankan deployment
./deploy.sh
```

### Atau Manual Deployment
```bash
# Build dan start services
docker-compose -f docker-compose.production.yml up -d --build

# Check status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f
```

## 🌐 Konfigurasi Nginx Proxy Manager

### 1. Akses NPM Admin
```
http://your-server-ip:81
```
- **Email**: `admin@example.com`
- **Password**: `changeme`

**GANTI PASSWORD SETELAH LOGIN PERTAMA!**

### 2. Setup Proxy Hosts

#### Frontend (aventra.my.id)
- **Domain Names**: `aventra.my.id`, `www.aventra.my.id`
- **Forward to**: `frontend:3501` (atau IP server Anda)
- **SSL**: Request certificate, Force SSL enabled

#### Backend API (api.aventra.my.id)
- **Domain Names**: `api.aventra.my.id`
- **Forward to**: `backend:8001` (atau IP server Anda)
- **SSL**: Request certificate, Force SSL enabled

### 3. Konfigurasi DNS
Pastikan DNS records sudah di-set:
- `aventra.my.id` → IP VPS
- `www.aventra.my.id` → IP VPS  
- `api.aventra.my.id` → IP VPS

## 📊 Setup Monitoring (Uptime Kuma)

### 1. Akses Uptime Kuma
```
http://your-server-ip:3001
```

### 2. Buat Account Admin
- Username: `admin`
- Password: Pilih password yang kuat

### 3. Tambah Monitor
- **Frontend**: `https://aventra.my.id`
- **Backend**: `https://api.aventra.my.id/health`
- **Interval**: 60 detik

### 4. Setup Notifikasi (Opsional)
- Telegram atau Email notifications

## 🔧 Testing Deployment

### Test Frontend
```bash
curl -I https://aventra.my.id
# Harus return HTTP 200
```

### Test Backend API
```bash
curl -I https://api.aventra.my.id/health
# Harus return HTTP 200
```

### Test Admin Panel
1. Buka `https://aventra.my.id/admin/login`
2. Login dengan credentials dari `.env.production`

## 🛡️ Security Hardening

### 1. Firewall Configuration
```bash
# Enable UFW
sudo ufw enable

# Allow necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 81/tcp    # NPM Admin (consider restricting)
```

### 2. Update Credentials
- Ganti semua password default
- Gunakan password yang kuat dan unik
- Simpan credentials dengan aman

### 3. Regular Updates
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose -f docker-compose.production.yml pull
docker-compose -f docker-compose.production.yml up -d
```

## 📈 Maintenance

### Backup Database
```bash
# Backup SQLite database
cp backend/portfolio.db backup/portfolio-$(date +%Y%m%d).db

# Backup dengan Docker
docker-compose -f docker-compose.production.yml exec backend cp portfolio.db backup/portfolio-$(date +%Y%m%d).db
```

### View Logs
```bash
# Semua logs
docker-compose -f docker-compose.production.yml logs -f

# Logs specific service
docker-compose -f docker-compose.production.yml logs -f backend
docker-compose -f docker-compose.production.yml logs -f frontend
```

### Restart Services
```bash
# Restart semua services
docker-compose -f docker-compose.production.yml restart

# Restart specific service
docker-compose -f docker-compose.production.yml restart backend
```

## 🐛 Troubleshooting

### Service Tidak Berjalan
```bash
# Check status semua services
docker-compose -f docker-compose.production.yml ps

# Check logs untuk error
docker-compose -f docker-compose.production.yml logs

# Restart services
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d
```

### SSL Certificate Issues
- Pastikan DNS sudah propagate
- Check logs NPM untuk error certificate
- Verify domain pointing ke IP yang benar

### Database Issues
```bash
# Reset database (HATI-HATI! Data akan hilang)
docker-compose -f docker-compose.production.yml exec backend rm portfolio.db
docker-compose -f docker-compose.production.yml restart backend

# Add sample data kembali
docker-compose -f docker-compose.production.yml exec backend python create_sample_data.py
```

### Port Conflicts
```bash
# Check port usage
sudo netstat -tulpn | grep :3501
sudo netstat -tulpn | grep :8001

# Kill process jika needed
sudo kill -9 <PID>
```

## 🔄 Update Application

### Dengan Git
```bash
# Pull latest changes
git pull origin main

# Rebuild dan restart
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d --build
```

### Manual Update
```bash
# Stop services
docker-compose -f docker-compose.production.yml down

# Upload files baru via SCP/SFTP

# Start services kembali
docker-compose -f docker-compose.production.yml up -d
```

## 📞 Support

### Resources
- **NPM Docs**: https://nginxproxymanager.com/
- **Uptime Kuma**: https://uptime.kuma.pet/
- **Docker Docs**: https://docs.docker.com/

### Log Locations
- Application logs: `docker-compose logs`
- NPM logs: `docker-compose logs nginx-proxy-manager`
- System logs: `/var/log/`

### Common Issues
1. **502 Bad Gateway**: Services belum ready, check logs
2. **SSL Errors**: DNS belum propagate atau certificate error
3. **CORS Errors**: Domain tidak match di CORS configuration
4. **Login Issues**: Check environment variables dan JWT configuration

---

## 🎯 Checklist Deployment

- [ ] VPS ready dengan Ubuntu 24.04
- [ ] Docker & Docker Compose terinstall
- [ ] Domain di-point ke IP VPS
- [ ] Environment variables dikonfigurasi
- [ ] Services berjalan dengan `docker-compose`
- [ ] NPM configured dengan SSL
- [ ] Monitoring setup dengan Uptime Kuma
- [ ] Security hardening applied
- [ ] Testing completed
- [ ] Backup strategy in place

**Selamat! Website portofolio Aventra Anda sudah live di production!** 🎉
