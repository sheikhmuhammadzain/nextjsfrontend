@echo off
echo ======================================================================
echo Starting UOL Chatbot with Authentication
echo ======================================================================
echo.

echo [Step 1] Make sure MongoDB is running...
echo    - Local: mongod
echo    - Atlas: Check connection string in .env.local
echo.

echo [Step 2] Starting Next.js Frontend...
npm run dev

pause
