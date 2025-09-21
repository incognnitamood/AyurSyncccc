# 🚀 How to Start AyurSync Servers

## ❌ Current Issue
The backend server is not running, which is why you're seeing "Failed to load patients" error.

## ✅ Solution: Start Both Servers

### Step 1: Start Backend Server

**Open Command Prompt/PowerShell and run:**

```bash
# Navigate to the project directory
cd C:\Users\sujat\OneDrive\Desktop\AyurSyncccc

# Go to backend folder
cd backend

# Install dependencies (if not already done)
npm install

# Start the backend server
node simple-server.js
```

**You should see:**
```
🚀 AyurSync Backend Server Started!
📡 Server running on: http://localhost:5000
❤️ Health check: http://localhost:5000/health
👥 Patients API: http://localhost:5000/api/patients
🍽️ Recipes API: http://localhost:5000/api/recipes

✅ Backend is ready! You can now start the frontend.
```

### Step 2: Start Frontend Server

**Open ANOTHER Command Prompt/PowerShell and run:**

```bash
# Navigate to the project directory
cd C:\Users\sujat\OneDrive\Desktop\AyurSyncccc

# Install dependencies (if not already done)
npm install

# Start the frontend server
npm run dev
```

**You should see:**
```
VITE v6.3.5  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## 🌐 Access the Application

1. **Open your browser**
2. **Go to**: http://localhost:5173
3. **Login with**:
   - Email: `doctor@ayursync.com`
   - Password: `password`

## ✅ What Should Work Now

1. **Dashboard**: Should show patient statistics
2. **Patient Management**: Should load patients from backend
3. **Recipe Database**: Should show recipes with search
4. **Diet Plan Generator**: Should allow generating plans

## 🐛 If Still Having Issues

### Check if servers are running:
- Backend: http://localhost:5000/health
- Frontend: http://localhost:5173

### Common fixes:
1. **Port already in use**: Try changing port in simple-server.js
2. **Node.js not installed**: Install Node.js from nodejs.org
3. **Dependencies missing**: Run `npm install` in both folders

## 📱 Expected Behavior

Once both servers are running:
- ✅ No more "Failed to load patients" error
- ✅ Patient Management page loads properly
- ✅ Dashboard shows content
- ✅ Recipe search works
- ✅ Diet plan generator works

---

**The application is fully functional - it just needs both servers running simultaneously!** 🚀
