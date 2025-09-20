@echo off
color 0A
title Lingua Phone - Frontend Fix and Redeploy

echo ========================================
echo Lingua Phone - Frontend Fix and Redeploy
echo ========================================
echo.

echo 1. Getting cluster credentials...
echo ================================
gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a
if %errorlevel% neq 0 (
    echo ERROR: Failed to get cluster credentials.
    pause
    exit /b 1
)

echo.
echo 2. Building frontend image with latest fixes...
echo ===========================================
docker build -t gcr.io/lingua-phone/lingua-frontend:latest -f docker/frontend-k8s.Dockerfile .
if %errorlevel% neq 0 (
    echo ERROR: Failed to build frontend image.
    pause
    exit /b 1
)

echo.
echo 3. Pushing frontend image to Google Container Registry...
echo ======================================================
docker push gcr.io/lingua-phone/lingua-frontend:latest
if %errorlevel% neq 0 (
    echo ERROR: Failed to push frontend image.
    pause
    exit /b 1
)

echo.
echo 4. Deleting existing frontend pod to force recreation...
echo ====================================================
kubectl delete pod -l app=lingua-frontend -n lingua-app
if %errorlevel% neq 0 (
    echo ERROR: Failed to delete frontend pod.
    pause
    exit /b 1
)

echo.
echo 5. Waiting for pod to be recreated (30 seconds)...
echo ==============================================
timeout /t 30 /nobreak >nul

echo.
echo 6. Checking pod status...
echo ========================
kubectl get pods -n lingua-app

echo.
echo ========================================
echo Frontend redeployment process completed!
echo ========================================
echo.
echo Please check the pod status above.
echo.
echo If the frontend pod now shows "1/1 Running" status, your application should be accessible.
echo.
echo If it's still showing CrashLoopBackOff:
echo 1. Check the logs: kubectl logs ^<frontend-pod-name^> -n lingua-app
echo 2. Verify the nginx configuration in docker/nginx-k8s.conf
echo.
echo To access your application:
echo   External IP: http://34.45.239.154
echo.
pause