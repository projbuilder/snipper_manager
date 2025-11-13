# 🚀 Deployment Guide - Code Snippet Manager

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git
- Docker & Docker Compose (optional, for containerized deployment)

## 📦 Quick Start (Development)

### 1. Install Dependencies

```powershell
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** (`backend\.env`):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/snippet-manager
JWT_ACCESS_SECRET=your-super-secret-access-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
```

**Frontend** (`frontend\.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Code Snippet Manager
```

### 3. Start MongoDB

```powershell
# Option 1: Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Option 2: Local MongoDB
# Start your local MongoDB service
```

### 4. Run Development Servers

```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Access the app at: **http://localhost:5173**

---

## 🐳 Docker Deployment

### Build and Run with Docker Compose

```powershell
# Build images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the app at: **http://localhost**

---

## ☁️ Production Deployment

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

**Frontend on Vercel:**

```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

**Backend on Railway:**

1. Create account at [Railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Add MongoDB plugin
4. Set environment variables
5. Deploy

**Backend on Render:**

1. Create account at [Render.com](https://render.com)
2. New Web Service → Connect GitHub repo
3. Build Command: `cd backend && npm install && npm run build`
4. Start Command: `cd backend && npm start`
5. Add environment variables

### Option 2: DigitalOcean/AWS/Azure (Full Stack)

1. **Provision VM/Droplet**
   - Ubuntu 22.04 LTS
   - 2GB+ RAM recommended

2. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt update
   sudo apt install -y mongodb-org

   # Start MongoDB
   sudo systemctl start mongod
   sudo systemctl enable mongod

   # Install Nginx
   sudo apt install -y nginx

   # Install PM2
   sudo npm install -g pm2
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/snippet-manager.git
   cd snippet-manager

   # Setup backend
   cd backend
   npm install
   npm run build
   pm2 start dist/server.js --name snippet-backend

   # Setup frontend
   cd ../frontend
   npm install
   npm run build
   ```

4. **Configure Nginx**
   ```nginx
   # /etc/nginx/sites-available/snippet-manager
   server {
       listen 80;
       server_name your-domain.com;

       # Frontend
       location / {
           root /path/to/snippet-manager/frontend/dist;
           try_files $uri $uri/ /index.html;
       }

       # Backend API
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   # Enable site
   sudo ln -s /etc/nginx/sites-available/snippet-manager /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **SSL with Let's Encrypt**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

6. **Setup PM2 Auto-restart**
   ```bash
   pm2 startup
   pm2 save
   ```

### Option 3: Kubernetes (Advanced)

See `k8s/` directory for Kubernetes manifests (create if needed).

---

## 🔒 Security Checklist for Production

- [ ] Change all default secrets in `.env` files
- [ ] Use strong JWT secrets (min 32 characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for your domain only
- [ ] Set `NODE_ENV=production`
- [ ] Enable MongoDB authentication
- [ ] Configure firewall rules
- [ ] Set up rate limiting (already configured in app)
- [ ] Regular security updates
- [ ] Enable MongoDB backups
- [ ] Monitor logs and errors (Sentry recommended)

---

## 📊 Monitoring & Maintenance

### Logs

```powershell
# PM2 logs
pm2 logs snippet-backend

# Docker logs
docker-compose logs -f backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Database Backup

```bash
# MongoDB backup
mongodump --db snippet-manager --out /backup/$(date +%Y%m%d)

# Restore
mongorestore --db snippet-manager /backup/20231115/snippet-manager
```

### Performance Monitoring

- **Sentry**: Error tracking
- **Prometheus + Grafana**: Metrics and dashboards
- **PM2 Plus**: Process monitoring
- **MongoDB Atlas**: Database monitoring (if using Atlas)

---

## 🔄 CI/CD Pipeline

The project includes GitHub Actions workflow (`.github/workflows/ci.yml`) that:

1. Runs tests on every push
2. Lints code
3. Builds Docker images
4. Deploys to production (configure secrets)

**Required GitHub Secrets:**
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `DEPLOY_SSH_KEY`
- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

---

## 🧪 Testing

```powershell
# Backend tests
cd backend
npm test
npm run test:coverage

# Frontend tests (to be added)
cd frontend
npm test
```

---

## 📱 Mobile/PWA (Future Enhancement)

Convert to Progressive Web App:
1. Add service worker
2. Create manifest.json
3. Enable offline mode
4. Add to home screen support

---

## 🆘 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists
- Check port 5000 is available
- Review logs: `npm run dev` output

### Frontend build fails
- Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
- Check Node version: `node --version` (should be 18+)
- Verify `.env` file has `VITE_API_URL`

### MongoDB connection errors
- Verify MongoDB is running: `sudo systemctl status mongod`
- Check connection string in `.env`
- Ensure MongoDB port 27017 is open

### CORS errors
- Verify `CORS_ORIGIN` in backend `.env` matches frontend URL
- Check frontend makes requests to correct API URL

---

## 📞 Support

- GitHub Issues: [Your Repo](https://github.com/yourusername/snippet-manager/issues)
- Documentation: See `/docs` folder
- Email: your-email@example.com

---

**🎉 Congratulations! Your Code Snippet Manager is now deployed!**
