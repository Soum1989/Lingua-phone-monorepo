@echo off
echo Installing and starting Lingua Phone servers...
cd packages\backend
call npm install
if %errorlevel% neq 0 (
    echo Backend npm install failed
    exit /b 1
)
echo Backend dependencies installed successfully
cd ..\frontend  
call npm install
if %errorlevel% neq 0 (
    echo Frontend npm install failed
    exit /b 1
)
echo Frontend dependencies installed successfully
echo.
echo To start the servers manually:
echo 1. Backend: cd packages\backend && npm run dev
echo 2. Frontend: cd packages\frontend && npm run dev
echo.
echo Backend will run on http://localhost:3001
echo Frontend will run on http://localhost:5173 
pause