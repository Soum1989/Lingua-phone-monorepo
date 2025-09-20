@echo off
color 0A
title Lingua Phone - Redeploy Frontend with Fix

echo ========================================
echo Lingua Phone - Redeploy Frontend with Fix
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
echo 2. Applying updated frontend deployment...
echo ======================================
kubectl apply -f k8s/frontend-deployment.yaml
if %errorlevel% neq 0 (
    echo ERROR: Failed to apply frontend deployment.
    pause
    exit /b 1
)

echo.
echo 3. Deleting existing frontend pod to force recreation...
echo ====================================================
kubectl delete pod -l app=lingua-frontend -n lingua-app
if %errorlevel% neq 0 (
    echo ERROR: Failed to delete frontend pod.
    pause
    exit /b 1
)

echo.
echo 4. Waiting for pod to be recreated (30 seconds)...
echo ==============================================
timeout /t 30 /nobreak >nul

echo.
echo 5. Checking pod status...
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
echo To access your application:
echo   External IP: http://34.45.239.154
echo.
pause