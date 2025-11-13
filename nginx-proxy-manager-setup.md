# Nginx Proxy Manager Setup Guide for Aventra Portfolio

This guide will help you configure Nginx Proxy Manager (NPM) to serve your Aventra Portfolio website with SSL.

## 🚀 Quick Setup Steps

### 1. Access Nginx Proxy Manager Admin
After deployment, access the NPM admin panel:
```
http://your-server-ip:81
```

Default login credentials:
- **Email**: `admin@example.com`
- **Password**: `changeme`

**IMPORTANT**: Change these credentials immediately after first login!

### 2. Configure Proxy Hosts

#### Frontend Proxy (aventra.my.id)
1. Go to **Hosts** → **Proxy Hosts** → **Add Proxy Host**
2. Fill in the details:

**Details Tab:**
- Domain Names: `aventra.my.id`, `www.aventra.my.id`
- Forward Hostname/IP: `frontend` (or your server IP if not using Docker network)
- Forward Port: `3501`
- Block Common Exploits: ✅ Enabled
- Websockets Support: ✅ Enabled

**SSL Tab:**
- SSL Certificate: **Request a new SSL Certificate**
- Force SSL: ✅ Enabled
- HTTP/2 Support: ✅ Enabled
- HSTS Enabled: ✅ Enabled
- HSTS Subdomains: ✅ Enabled

#### Backend API Proxy (api.aventra.my.id)
1. Go to **Hosts** → **Proxy Hosts** → **Add Proxy Host**
2. Fill in the details:

**Details Tab:**
- Domain Names: `api.aventra.my.id`
- Forward Hostname/IP: `backend` (or your server IP if not using Docker network)
- Forward Port: `8001`
- Block Common Exploits: ✅ Enabled
- Websockets Support: ✅ Enabled

**SSL Tab:**
- SSL Certificate: **Request a new SSL Certificate**
- Force SSL: ✅ Enabled
- HTTP/2 Support: ✅ Enabled
- HSTS Enabled: ✅ Enabled

### 3. Advanced Configuration

#### Custom Nginx Configuration for Frontend
In the **Advanced** tab for frontend proxy, add:

```nginx
# Custom error pages
error_page 404 /404.html;
error_page 500 502 503 504 /50x.html;

# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Next.js specific
location /_next/static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

#### Custom Nginx Configuration for Backend API
In the **Advanced** tab for backend proxy, add:

```nginx
# CORS headers for API
add_header 'Access-Control-Allow-Origin' 'https://aventra.my.id' always;
add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;

# API rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api/ {
    limit_req zone=api burst=20 nodelay;
    
    # Proxy settings
    proxy_pass http://backend:8001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Handle preflight requests
if ($request_method = 'OPTIONS') {
    add_header 'Access-Control-Allow-Origin' 'https://aventra.my.id';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
    add_header 'Access-Control-Max-Age' 1728000;
    add_header 'Content-Type' 'text/plain; charset=utf-8';
    add_header 'Content-Length' 0;
    return 204;
}
```

### 4. SSL Certificate Setup

#### Using Let's Encrypt
1. In each proxy host SSL tab, select "Request a new SSL Certificate"
2. Enter your email for certificate notifications
3. Enable "I agree to the Let's Encrypt TOS"
4. Enable "Force SSL" and other security options
5. Save and wait for certificate issuance

#### Troubleshooting SSL Issues
- Ensure domain DNS is properly configured
- Check that ports 80 and 443 are open
- Verify domain points to your server IP
- Check NPM logs for certificate errors

### 5. DNS Configuration

Ensure your DNS records are properly configured:

**A Records:**
- `aventra.my.id` → Your server IP
- `www.aventra.my.id` → Your server IP
- `api.aventra.my.id` → Your server IP

**CNAME Record (alternative):**
- `www` → `aventra.my.id`

### 6. Testing Your Setup

#### Test Frontend
```bash
curl -I https://aventra.my.id
# Should return HTTP 200
```

#### Test Backend API
```bash
curl -I https://api.aventra.my.id/health
# Should return HTTP 200
```

#### Test SSL Certificate
```bash
openssl s_client -connect aventra.my.id:443 -servername aventra.my.id < /dev/null
```

### 7. Monitoring and Logs

#### Access NPM Logs
```bash
# View NPM logs
docker-compose -f docker-compose.production.yml logs nginx-proxy-manager

# View access logs
docker exec -it aventra-portfolio_nginx-proxy-manager_1 tail -f /var/log/nginx/access.log

# View error logs
docker exec -it aventra-portfolio_nginx-proxy-manager_1 tail -f /var/log/nginx/error.log
```

#### Monitor SSL Certificates
- NPM will automatically renew certificates
- Check certificate status in NPM admin panel
- Set up email notifications for certificate issues

### 8. Security Best Practices

#### Change Default Credentials
- Change NPM admin email and password immediately
- Use strong, unique passwords

#### Firewall Configuration
Ensure only necessary ports are open:
```bash
# Required ports
80 (HTTP)
443 (HTTPS)
81 (NPM Admin - consider restricting access)
22 (SSH)
```

#### Regular Updates
```bash
# Update NPM
docker-compose -f docker-compose.production.yml pull nginx-proxy-manager
docker-compose -f docker-compose.production.yml up -d nginx-proxy-manager
```

### 9. Troubleshooting Common Issues

#### Certificate Not Issuing
- Check DNS propagation
- Verify domain points to correct IP
- Check NPM logs for ACME challenges

#### 502 Bad Gateway
- Check if backend/frontend services are running
- Verify proxy host configuration
- Check Docker container logs

#### CORS Errors
- Verify CORS headers in backend configuration
- Check domain names match exactly
- Test API calls from browser console

### 10. Backup and Recovery

#### Backup NPM Configuration
```bash
# Backup NPM data
tar -czf npm-backup-$(date +%Y%m%d).tar.gz data/nginx-proxy-manager/
```

#### Restore NPM Configuration
```bash
# Stop NPM
docker-compose -f docker-compose.production.yml stop nginx-proxy-manager

# Restore backup
tar -xzf npm-backup-YYYYMMDD.tar.gz

# Start NPM
docker-compose -f docker-compose.production.yml start nginx-proxy-manager
```

---

**Need Help?**
- Check NPM documentation: https://nginxproxymanager.com/
- View application logs: `docker-compose logs -f`
- Check NPM admin panel for detailed error messages
