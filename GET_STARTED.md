# 🎯 Get Started - Code Snippet Manager

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Backend Dependencies

```powershell
cd backend
npm install
```

### Step 2: Install Frontend Dependencies

```powershell
cd ../frontend  
npm install
```

### Step 3: Setup Environment Files

Create `backend\.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/snippet-manager
JWT_ACCESS_SECRET=dev-access-secret-change-this
JWT_REFRESH_SECRET=dev-refresh-secret-change-this
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
```

Create `frontend\.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Start MongoDB

**Option A - Docker (Recommended):**
```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B - MongoDB Atlas (Cloud):**
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in `backend\.env`

### Step 5: Start Development Servers

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Step 6: Open Browser

Navigate to **http://localhost:5173**

---

## 🧪 Test the Application

### 1. Register a New User

- Click "Sign Up"
- Enter:
  - Username: `testuser`
  - Display Name: `Test User`
  - Email: `test@example.com`
  - Password: `Test1234`

### 2. Create a Snippet

- Click "+ New Snippet"
- Enter title, code, select language
- Save

### 3. Explore Features

- ✅ Create, edit, delete snippets
- ✅ Search and filter
- ✅ Fork public snippets
- ✅ Star snippets
- ✅ Create collections

---

## 📋 Project Structure

```
MERN_Project/
├── backend/              # Express + MongoDB API
│   ├── src/
│   │   ├── config/      # Database & env config
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Auth, validation, etc.
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API routes
│   │   ├── utils/       # Helpers, validators
│   │   └── server.ts    # Entry point
│   └── package.json
│
├── frontend/            # React + TypeScript UI
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Route pages
│   │   ├── services/    # API calls
│   │   ├── store/       # Zustand state
│   │   ├── types/       # TypeScript types
│   │   └── App.tsx      # Main app
│   └── package.json
│
├── docker-compose.yml   # Multi-container setup
└── README.md           # Full documentation
```

---

## 🚀 Available Scripts

### Backend

```powershell
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production server
npm test         # Run tests
npm run lint     # Lint code
```

### Frontend

```powershell
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
```

---

## 🔧 Common Commands

### Reset Database
```powershell
# MongoDB shell
mongo
> use snippet-manager
> db.dropDatabase()
```

### Stop All Services
```powershell
# Stop backend: Ctrl+C in terminal
# Stop frontend: Ctrl+C in terminal
# Stop MongoDB: docker stop mongodb
```

### Clean Install
```powershell
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Backend (Port 5000):**
```powershell
# Windows: Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Frontend (Port 5173):**
- Vite usually auto-increments to 5174 if 5173 is busy

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
- Verify MongoDB is running: `docker ps` (should show mongodb container)
- Or start it: `docker start mongodb`

### Module Not Found

```
Error: Cannot find module 'express'
```

**Solution:**
- Run `npm install` in the respective directory

---

## 📚 Next Steps

1. **Read Full Documentation**: See `README.md`
2. **Deployment Guide**: See `DEPLOYMENT_GUIDE.md`
3. **API Documentation**: See `QUICKSTART.md` for API endpoints
4. **Feature Implementation Status**: See `IMPLEMENTATION_STATUS.md`

---

## 🎨 Tech Stack

### Backend
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Zod Validation

### Frontend
- React 18
- TypeScript
- React Router
- Zustand (State)
- TailwindCSS
- Monaco Editor
- Prism.js

### DevOps
- Docker & Docker Compose
- GitHub Actions CI/CD
- Nginx (Production)

---

## ✨ Features

✅ User Authentication (JWT)  
✅ Snippet CRUD Operations  
✅ Syntax Highlighting (100+ languages)  
✅ Advanced Search & Filters  
✅ Fork System  
✅ Star/Favorite Snippets  
✅ Collections/Folders  
✅ Visibility Controls (Public/Private/Unlisted)  
✅ Audit Logging  
✅ Rate Limiting  
✅ Responsive Design  

---

**🎉 You're all set! Happy coding!**
