@echo off
color 0A
title Lingua Phone - Complete Frontend Fix

echo ========================================
echo     LINGUA PHONE COMPLETE FRONTEND FIX
echo ========================================
echo.

echo 1. Building frontend Docker image...
echo =============================
docker build -t gcr.io/lingua-phone/lingua-frontend:latest -f packages/frontend/Dockerfile.k8s packages/frontend
if %errorlevel% neq 0 (
    echo ERROR: Failed to build frontend image
    pause
    exit /b %errorlevel%
)
echo.

echo 2. Pushing frontend image to Google Container Registry...
echo ===============================================
gcloud auth configure-docker
docker push gcr.io/lingua-phone/lingua-frontend:latest
if %errorlevel% neq 0 (
    echo ERROR: Failed to push frontend image
    pause
    exit /b %errorlevel%
)
echo.

echo 3. Deleting existing frontend pods to force recreation...
echo ===============================================
kubectl delete pods -n lingua-app -l app=lingua-frontend
echo.

echo 4. Waiting for pods to restart...
echo =======================
timeout /t 30
echo.

echo 5. Checking pod status...
echo ================
kubectl get pods -n lingua-app
echo.

echo ========================================
echo           FIX PROCESS COMPLETE
echo ========================================
echo.
echo The frontend pods have been deleted and should be recreated with the new image.
echo Please run "application-status-check.bat" in a few minutes to verify if the issue is resolved.
echo.
pause