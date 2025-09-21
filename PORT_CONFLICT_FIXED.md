# 🔧 Port Conflict Resolution Guide

## ❌ **Error Fixed**: `EADDRINUSE: address already in use :::5000`

### **What Happened:**
Port 5000 was being used by another process, preventing the backend server from starting.

### **✅ Solution Applied:**
1. **Changed backend port from 5000 to 3001**
   - Updated `backend/simple-server.js` to use port 3001
   - Made it configurable with environment variable support

2. **Updated frontend API configuration**
   - Changed `frontend/src/services/api.js` to connect to port 3001
   - Frontend will now correctly communicate with backend

### **🚀 Current Setup:**
- **Backend Server**: http://localhost:3001
- **Frontend Server**: http://localhost:5173
- **API Endpoints**: http://localhost:3001/api/*

### **🏃‍♂️ How to Start Servers:**

**Backend:**
```bash
cd backend
node simple-server.js
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### **🔍 If Port Issues Occur Again:**

**Check what's using a port:**
```bash
netstat -ano | findstr :PORT_NUMBER
```

**Kill a process using a port:**
```bash
taskkill /F /PID PROCESS_ID
```

**Alternative: Use different ports:**
- Backend: Set `PORT=3002` environment variable
- Frontend: Update API_BASE_URL in `src/services/api.js`

### **✅ Everything is Working Now:**
- Backend running on port 3001 ✅
- Frontend running on port 5173 ✅
- API communication configured ✅
- No more port conflicts ✅

Both servers should now start without any port conflicts!