@echo off
color 0A
title Lingua Phone - Rebuild and Push Frontend

echo ========================================
echo Lingua Phone - Rebuild and Push Frontend
echo ========================================
echo.

echo 1. Building frontend Docker image...
echo ==========================
docker build -t gcr.io/lingua-phone/lingua-frontend:latest -f docker/frontend-k8s.Dockerfile .
if %errorlevel% neq 0 (
    echo Error building Docker image
    pause
    exit /b 1
)
echo.

echo 2. Pushing frontend image to Google Container Registry...
echo ==============================================
docker push gcr.io/lingua-phone/lingua-frontend:latest
if %errorlevel% neq 0 (
    echo Error pushing Docker image
    pause
    exit /b 1
)
echo.

echo 3. Deleting existing frontend pods to force recreation...
echo =============================================
kubectl delete pod -l app=lingua-frontend -n lingua-app
if %errorlevel% neq 0 (
    echo Error deleting frontend pods
    pause
    exit /b 1
)
echo.

echo ========================================
echo Rebuild and push complete!
echo ========================================
echo.
echo Waiting 30 seconds for pods to restart...
timeout /t 30 /nobreak >nul
echo.

echo Checking pod status...
kubectl get pods -n lingua-app
echo.

pause