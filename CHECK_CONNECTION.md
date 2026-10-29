# 🔧 Connection Error Fix

## ❌ Error: ECONNREFUSED

This means the Next.js frontend can't connect to the FastAPI backend.

## ✅ Quick Fix

### 1. **Make Sure Backend is Running**

Open a new terminal and run:
```cmd
cd c:\Users\ibrahim laptops\Desktop\fypcag
start_backend.bat
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
✓ Configuration validated
✓ Vector DB loaded: 1020 documents
```

### 2. **Test Backend Directly**

Open browser and go to:
```
http://127.0.0.1:8000/health
```

Should show:
```json
{
  "status": "healthy",
  "app_name": "UOL RAG Chatbot",
  "total_documents": 1020
}
```

### 3. **Restart Next.js**

In your Next.js terminal:
- Press `Ctrl+C` to stop
- Run `npm run dev` again

### 4. **Check Port 8000**

Make sure nothing else is using port 8000:
```cmd
netstat -ano | findstr :8000
```

If something is using it, kill the process or change the port.

## 🔍 Troubleshooting Steps

### Step 1: Verify Backend is Running
```cmd
curl http://127.0.0.1:8000/health
```

**Expected:** JSON response with status "healthy"  
**If fails:** Backend is not running

### Step 2: Check Firewall
Windows Firewall might be blocking the connection.

**Fix:**
1. Search "Windows Defender Firewall"
2. Click "Allow an app through firewall"
3. Find Python and check both Private and Public
4. Click OK

### Step 3: Check .env.local
```cmd
cd nextjsfrontend
type .env.local
```

Should show:
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### Step 4: Restart Both Servers

**Terminal 1 - Backend:**
```cmd
cd c:\Users\ibrahim laptops\Desktop\fypcag
start_backend.bat
```

**Terminal 2 - Frontend:**
```cmd
cd c:\Users\ibrahim laptops\Desktop\fypcag\nextjsfrontend
npm run dev
```

## 🚀 Correct Startup Order

### Option 1: Manual (Recommended for debugging)

**Terminal 1:**
```cmd
cd c:\Users\ibrahim laptops\Desktop\fypcag
start_backend.bat
```

Wait for: `✓ Vector DB loaded`

**Terminal 2:**
```cmd
cd c:\Users\ibrahim laptops\Desktop\fypcag\nextjsfrontend
npm run dev
```

**Browser:**
```
http://localhost:3000
```

### Option 2: Automatic

```cmd
cd c:\Users\ibrahim laptops\Desktop\fypcag
start_fullstack.bat
```

## 🔧 Common Issues

### Issue 1: "Backend not running"
**Solution:**
```cmd
start_backend.bat
```

### Issue 2: "Port 8000 in use"
**Solution:**
```cmd
# Find process
netstat -ano | findstr :8000

# Kill it
taskkill /PID <process_id> /F

# Or change port in .env
API_PORT=8001
```

### Issue 3: "localhost vs 127.0.0.1"
**Solution:** Already fixed! We use `127.0.0.1` now.

### Issue 4: "CORS error"
**Solution:** Backend already allows all origins in development.

### Issue 5: "Module not found"
**Solution:**
```cmd
cd nextjsfrontend
npm install
```

## ✅ Verification Checklist

- [ ] Backend running on http://127.0.0.1:8000
- [ ] Can access http://127.0.0.1:8000/health in browser
- [ ] Shows "healthy" status
- [ ] .env.local has correct URL
- [ ] Next.js running on http://localhost:3000
- [ ] No firewall blocking
- [ ] No other app using port 8000

## 🎯 Quick Test

### Test Backend
```cmd
curl http://127.0.0.1:8000/health
```

### Test Frontend
Open browser:
```
http://localhost:3000
```

Type a message and press Enter.

## 📝 Still Not Working?

### Check Backend Logs
Look in the backend terminal for errors.

### Check Frontend Logs
Look in the Next.js terminal for errors.

### Check Browser Console
Press F12 in browser, check Console tab.

### Try Direct API Call
```cmd
curl -X POST http://127.0.0.1:8000/api/query/stream ^
  -H "Content-Type: application/json" ^
  -d "{\"query\": \"test\"}"
```

Should stream response.

## 🎉 Success Indicators

### Backend Terminal:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
✓ Configuration validated
✓ Vector DB loaded: 1020 documents
✓ Generation model: gemini-2.5-flash
```

### Frontend Terminal:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

### Browser:
- Chat interface loads
- Can type message
- Response streams in real-time
- No errors in console (F12)

---

**Most Common Fix:** Just make sure `start_backend.bat` is running first! 🚀
