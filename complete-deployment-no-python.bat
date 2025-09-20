@echo off
color 0A
title Lingua Phone - Complete Deployment

echo ========================================
echo Lingua Phone - Complete Deployment
echo ========================================
echo.

echo This script will:
echo 1. Get cluster credentials
echo 2. Build and push updated Docker images
echo 3. Delete existing pods to force recreation
echo 4. Check the status of the pods
echo.

echo Press any key to continue or Ctrl+C to cancel...
pause >nul
echo.

echo 1. Getting cluster credentials...
echo ================================
gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to get cluster credentials.
    echo Please make sure you're authenticated with Google Cloud.
    echo Run: gcloud auth login
    pause
    exit /b 1
)
echo.

echo 2. Building backend image...
echo ===========================
docker build -t gcr.io/lingua-phone/lingua-backend:latest -f docker/backend.Dockerfile .
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to build backend image.
    pause
    exit /b 1
)
echo.

echo 3. Building frontend image...
echo ============================
docker build -t gcr.io/lingua-phone/lingua-frontend:latest -f docker/frontend-k8s.Dockerfile .
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to build frontend image.
    pause
    exit /b 1
)
echo.

echo 4. Pushing backend image...
echo ==========================
docker push gcr.io/lingua-phone/lingua-backend:latest
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to push backend image.
    pause
    exit /b 1
)
echo.

echo 5. Pushing frontend image...
echo ===========================
docker push gcr.io/lingua-phone/lingua-frontend:latest
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to push frontend image.
    pause
    exit /b 1
)
echo.

echo 6. Deleting existing pods to force recreation...
echo ==============================================
kubectl delete pods -n lingua-app --all
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to delete existing pods.
    pause
    exit /b 1
)
echo.

echo 7. Waiting for pods to be recreated (30 seconds)...
echo =================================================
timeout /t 30 /nobreak >nul
echo.

echo 8. Checking pod status...
echo ========================
kubectl get pods -n lingua-app
echo.

echo ========================================
echo Deployment process completed!
echo ========================================
echo.
echo Please check the pod status above.
echo.
echo If both pods show "1/1 Running" status, your application is successfully deployed.
echo.
echo If the frontend pod is still showing CrashLoopBackOff:
echo 1. Check the logs: kubectl logs ^<frontend-pod-name^> -n lingua-app
echo 2. Verify the nginx configuration in docker/nginx-k8s.conf
echo 3. Make sure it contains: server lingua-backend-service:3002;
echo.
echo To get the external IP of your application:
echo   kubectl get services -n lingua-app
echo.
echo Access your application through the external IP shown above.
echo.
pause