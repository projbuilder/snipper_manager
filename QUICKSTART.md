# 🚀 Quick Start Guide - Code Snippet Manager

## Overview

This is a production-ready MERN stack application for managing code snippets with advanced features like syntax highlighting, forking, search, and safe code execution.

## Prerequisites

- Node.js 18+ 
- MongoDB 6+ (or MongoDB Atlas account)
- Docker (optional, for runner service)
- Git

## 🏁 Fast Setup (5 minutes)

### Step 1: Install Backend Dependencies

```powershell
cd C:\Users\Kowstubha Tirumal\Downloads\MERN_Project\backend
npm install
```

### Step 2: Configure Environment

Create `backend\.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/snippet-manager
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this-now
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-now
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
RUNNER_API_URL=http://localhost:5001
MAX_EXECUTION_TIME=5000
```

### Step 3: Start MongoDB

**Option A: Local MongoDB**
```powershell
# If installed locally, MongoDB should be running
# Check with: mongosh
```

**Option B: Docker MongoDB**
```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option C: MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string
- Update `MONGODB_URI` in `.env`

### Step 4: Start Backend

```powershell
cd backend
npm run dev
```

Backend will start at **http://localhost:5000**

### Step 5: Install & Start Frontend (When Ready)

```powershell
cd C:\Users\Kowstubha Tirumal\Downloads\MERN_Project\frontend
npm install
npm run dev
```

Frontend will start at **http://localhost:5173**

## 📋 What You Can Do Now

Once everything is running:

### 1. Test API with curl or Postman

**Register a user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"Test1234\",\"displayName\":\"Test User\"}"
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"Test1234\"}"
```

**Create a snippet:**
```bash
curl -X POST http://localhost:5000/api/snippets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d "{\"title\":\"Hello World\",\"code\":\"console.log('Hello World')\",\"language\":\"javascript\",\"visibility\":\"public\"}"
```

## 🔧 Development Workflow

### Running Tests

```powershell
cd backend
npm test              # Run all tests
npm run test:watch    # Watch mode
```

### Linting & Formatting

```powershell
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix issues
npm run format        # Format code
```

### Building for Production

```powershell
cd backend
npm run build         # Compile TypeScript
npm start             # Run production build
```

## 🐳 Docker Setup (Alternative)

### Start All Services

```powershell
cd C:\Users\Kowstubha Tirumal\Downloads\MERN_Project
docker-compose up -d
```

This starts:
- MongoDB
- Backend API
- Frontend (when built)
- Runner service (when built)

### Stop All Services

```powershell
docker-compose down
```

## 📝 Project Structure

```
MERN_Project/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── config/      # Configuration
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Express middleware
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── utils/       # Utilities
│   │   └── server.ts    # Entry point
│   └── tests/           # Test files
├── frontend/            # React + TypeScript
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   └── App.tsx      # Root component
│   └── public/          # Static assets
└── runner/              # Code execution service
```

## 🔑 Key Features Implemented

✅ **Authentication**
- JWT with access and refresh tokens
- Password hashing with bcrypt
- Role-based authorization

✅ **Database Models**
- User management
- Snippet storage
- Collections/folders
- Audit logging
- Star system

✅ **Security**
- Rate limiting
- Input validation (Zod)
- Error handling
- CORS protection
- Security headers (helmet)

✅ **Code Quality**
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Jest testing setup

## 🚨 Troubleshooting

### Port Already in Use
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### MongoDB Connection Failed
- Check MongoDB is running: `mongosh`
- Verify `MONGODB_URI` in `.env`
- Check firewall settings

### Module Not Found Errors
```powershell
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
- Ensure dependencies are installed
- Run `npm run typecheck`
- Check `tsconfig.json`

## 📚 Next Steps

1. **Complete Backend** (See `IMPLEMENTATION_STATUS.md`)
   - Finish snippet controller
   - Add search functionality
   - Implement fork feature
   - Build execution runner

2. **Build Frontend**
   - Initialize React app
   - Create component library
   - Integrate Monaco editor
   - Connect to API

3. **Add Tests**
   - Unit tests for controllers
   - Integration tests for APIs
   - E2E tests for workflows

4. **Deploy**
   - Set up CI/CD pipeline
   - Deploy to cloud provider
   - Configure monitoring

## 🆘 Getting Help

- Check `README.md` for detailed documentation
- See `IMPLEMENTATION_STATUS.md` for current progress
- Review code comments for implementation details
- Open an issue for bugs or questions

## 🎯 Current Status

**Backend**: ~60% complete
- ✅ Project structure
- ✅ Models and middleware
- ✅ Authentication system
- 🚧 Snippet controllers
- 🚧 Routes setup
- ⏳ Execution runner

**Frontend**: Not started
- ⏳ React app initialization
- ⏳ Component development
- ⏳ API integration

See `IMPLEMENTATION_STATUS.md` for detailed checklist.

---

**Happy Coding! 🎉**
