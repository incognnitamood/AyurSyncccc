# 🚀 AyurSync Quick Start Guide

## ⚠️ Current Issue: Backend Server Not Running

The application is showing "Failed to load patients" because the backend server is not running. Here's how to fix it:

## 🔧 Step-by-Step Fix

### 1. Start the Backend Server

**Option A: Using the batch file (Windows)**
```bash
# Double-click on start-backend.bat
# OR run in command prompt:
start-backend.bat
```

**Option B: Manual start**
```bash
# Open a new command prompt/terminal
cd backend
npm install
node test-server.js
```

### 2. Start the Frontend

**Option A: Using the batch file (Windows)**
```bash
# Double-click on start-frontend.bat
# OR run in command prompt:
start-frontend.bat
```

**Option B: Manual start**
```bash
# Open another command prompt/terminal
npm install
npm run dev
```

## 🌐 Access the Application

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🔑 Login Credentials

- **Email**: doctor@ayursync.com
- **Password**: password

## ✅ What Should Work After Starting Backend

1. **Patient Management**: Add new patients, data will persist
2. **Recipe Database**: Search with autocomplete functionality
3. **Diet Plan Generator**: Generate AI-powered meal plans
4. **Dashboard**: Show patient statistics and overview

## 🐛 Troubleshooting

### Backend won't start?
- Make sure Node.js is installed
- Check if port 5000 is available
- Try running: `npm install` in the backend folder first

### Frontend shows errors?
- Make sure backend is running on port 5000
- Check browser console for specific errors
- Try refreshing the page

### Still having issues?
- Check that both servers are running
- Verify URLs: Frontend (5173) and Backend (5000)
- Make sure no firewall is blocking the ports

## 📱 Expected Behavior

Once both servers are running:

1. **Login Page**: Enter demo credentials
2. **Dashboard**: Should show patient statistics
3. **Patient Management**: Should load existing patients or show demo data
4. **Recipe Database**: Should show recipes with search functionality
5. **Diet Plan Generator**: Should allow generating meal plans

## 🎯 Next Steps

After getting the basic functionality working:
1. Set up MongoDB for full data persistence
2. Add OpenAI API key for AI features
3. Configure production environment variables

---

**The application is fully functional - it just needs both servers running!** 🚀
