# Uptime Kuma Monitoring Setup Guide

This guide will help you set up Uptime Kuma for monitoring your Aventra Portfolio website.

## 🚀 Quick Setup

### 1. Access Uptime Kuma
After deployment, access Uptime Kuma:
```
http://your-server-ip:3001
```

### 2. Initial Setup
1. **Create Admin Account**
   - Username: `admin` (or your preferred username)
   - Password: Choose a strong password
   - Confirm Password: Re-enter your password

2. **Setup Complete**
   - You'll be redirected to the main dashboard

## 📊 Monitoring Configuration

### 1. Add Monitoring Targets

#### Frontend Monitoring
1. Click **"Add New Monitor"**
2. Configure as follows:

**General:**
- Monitor Type: **HTTP(s)**
- Friendly Name: `Aventra Portfolio Frontend`
- URL: `https://aventra.my.id`
- Heartbeat Interval: `60` seconds
- Retries: `2` times
- Timeout: `30` seconds

**Advanced:**
- Accepted Status Codes: `200-299`
- Check SSL Certificate: ✅ Enabled
- Follow Redirects: ✅ Enabled

#### Backend API Monitoring
1. Click **"Add New Monitor"**
2. Configure as follows:

**General:**
- Monitor Type: **HTTP(s)**
- Friendly Name: `Aventra Portfolio API`
- URL: `https://api.aventra.my.id/health`
- Heartbeat Interval: `60` seconds
- Retries: `2` times
- Timeout: `30` seconds

**Advanced:**
- Accepted Status Codes: `200-299`
- Check SSL Certificate: ✅ Enabled
- Follow Redirects: ✅ Enabled

#### Database Health Check (Optional)
1. Click **"Add New Monitor"**
2. Configure as follows:

**General:**
- Monitor Type: **HTTP(s)**
- Friendly Name: `Database Health`
- URL: `https://api.aventra.my.id/api/projects`
- Heartbeat Interval: `120` seconds
- Retries: `3` times
- Timeout: `45` seconds

### 2. Notification Setup

#### Telegram Notifications (Recommended)
1. Go to **Settings** → **Notifications**
2. Click **"Setup Notification"**
3. Select **Telegram**
4. Configure:

**Telegram Bot Setup:**
1. Message `@BotFather` on Telegram
2. Send `/newbot` command
3. Follow instructions to create a bot
4. Get the bot token

**Get Chat ID:**
1. Start a chat with your bot
2. Send any message
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Find your chat ID in the response

**Uptime Kuma Configuration:**
- Name: `Telegram`
- Bot Token: `Your bot token from BotFather`
- Chat ID: `Your chat ID`
- Test the notification

#### Email Notifications
1. Go to **Settings** → **Notifications**
2. Click **"Setup Notification"**
3. Select **Email (SMTP)**
4. Configure:

**SMTP Settings:**
- Name: `Email`
- Host: `smtp.gmail.com` (or your SMTP server)
- Port: `587`
- Username: `your-email@gmail.com`
- Password: `Your app password`
- To: `abi@aventra.my.id`
- Test the notification

### 3. Status Page Setup

#### Create Public Status Page
1. Go to **Settings** → **Status Page**
2. Click **"Add New Status Page"**
3. Configure:

**General:**
- Title: `Aventra Portfolio Status`
- Description: `Real-time status of Aventra Portfolio services`
- Theme: Choose your preferred theme
- Published: ✅ Enabled

**Custom Domain (Optional):**
- If you want `status.aventra.my.id`
- Configure in Nginx Proxy Manager first

**Add Monitors to Status Page:**
1. Go to your status page
2. Click **"Edit"**
3. Add all your monitors
4. Set appropriate categories (Frontend, Backend, Database)

### 4. Advanced Configuration

#### Heartbeat Configuration
For each monitor, consider these advanced settings:

**Frontend:**
- Heartbeat Interval: `60` seconds
- Retries: `2`
- Timeout: `30` seconds
- Accepted Status Codes: `200-299`

**Backend API:**
- Heartbeat Interval: `60` seconds  
- Retries: `3`
- Timeout: `45` seconds
- Accepted Status Codes: `200-299`

#### SSL Certificate Monitoring
Add SSL certificate expiration monitoring:

1. **Add New Monitor**
2. Monitor Type: **TCP Port**
3. Friendly Name: `SSL Certificate - aventra.my.id`
4. Hostname: `aventra.my.id`
5. Port: `443`
6. Heartbeat Interval: `3600` seconds (1 hour)

### 5. Dashboard Customization

#### Create Monitoring Groups
1. Go to **Settings** → **General**
2. Scroll to **Monitor Groups**
3. Create groups:
   - `Frontend Services`
   - `Backend Services`
   - `Infrastructure`

#### Custom CSS (Optional)
1. Go to **Settings** → **Custom CSS**
2. Add custom styling:
```css
/* Custom status page styling */
.status-page {
    font-family: 'Inter', sans-serif;
}

.monitor-card {
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### 6. Backup and Maintenance

#### Backup Uptime Kuma Data
```bash
# Backup Uptime Kuma data
docker-compose -f docker-compose.production.yml exec uptime-kuma tar -czf /app/data/backup-$(date +%Y%m%d).tar.gz /app/data/

# Copy backup to host
docker cp aventra-portfolio_uptime-kuma_1:/app/data/backup-YYYYMMDD.tar.gz ./backup/
```

#### Restore Uptime Kuma Data
```bash
# Stop Uptime Kuma
docker-compose -f docker-compose.production.yml stop uptime-kuma

# Restore backup
docker cp ./backup/backup-YYYYMMDD.tar.gz aventra-portfolio_uptime-kuma_1:/app/data/
docker-compose -f docker-compose.production.yml exec uptime-kuma tar -xzf /app/data/backup-YYYYMMDD.tar.gz -C /app/data/

# Start Uptime Kuma
docker-compose -f docker-compose.production.yml start uptime-kuma
```

#### Update Uptime Kuma
```bash
# Pull latest image
docker-compose -f docker-compose.production.yml pull uptime-kuma

# Restart service
docker-compose -f docker-compose.production.yml up -d uptime-kuma
```

### 7. Security Best Practices

#### Access Control
- Use strong, unique passwords
- Consider setting up basic auth for status page
- Restrict access to Uptime Kuma admin panel

#### Network Security
- Only expose necessary ports (3001 for admin, 80/443 for status page)
- Use firewall rules to restrict access
- Consider VPN access for admin panel

### 8. Troubleshooting

#### Common Issues

**Monitor Showing Down When Service is Up**
- Check firewall rules
- Verify URL and port
- Check if service is accessible from Uptime Kuma container

**Notifications Not Working**
- Test notification configuration
- Check SMTP/Telegram credentials
- Verify network connectivity

**High Resource Usage**
- Increase heartbeat intervals
- Reduce number of monitors
- Monitor Uptime Kuma container resources

#### Logs and Debugging
```bash
# View Uptime Kuma logs
docker-compose -f docker-compose.production.yml logs -f uptime-kuma

# Check container status
docker-compose -f docker-compose.production.yml ps uptime-kuma

# Access container shell
docker-compose -f docker-compose.production.yml exec uptime-kuma sh
```

### 9. Integration with Other Services

#### Health Check Endpoints
Ensure your services have proper health check endpoints:

**Backend Health Check:**
```python
# In your FastAPI backend
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}
```

**Frontend Health Check:**
- Uptime Kuma can check if the frontend loads successfully

### 10. Performance Optimization

#### Monitor Intervals
- Critical services: 60 seconds
- Important services: 120 seconds  
- Non-critical: 300 seconds

#### Database Optimization
- Regular cleanup of old monitoring data
- Consider database maintenance tasks
- Monitor Uptime Kuma's own database size

---

**Need Help?**
- Uptime Kuma Documentation: https://uptime.kuma.pet/
- GitHub Issues: https://github.com/louislam/uptime-kuma/issues
- Community Support: Discord and GitHub Discussions
