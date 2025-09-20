@echo off
color 0A
title Lingua Phone - Deployment Status

echo ========================================
echo Lingua Phone - Deployment Status
echo ========================================
echo.

echo 1. Checking pod status...
echo =======================
kubectl get pods -n lingua-app

echo.
echo 2. Checking service status...
echo ===========================
kubectl get services -n lingua-app

echo.
echo 3. Checking if frontend is running...
echo ==================================
kubectl get pods -n lingua-app | findstr lingua-frontend

if %errorlevel% equ 0 (
    echo Frontend pod found.
) else (
    echo Frontend pod not found.
)

echo.
echo ========================================
echo Status check completed!
echo ========================================
echo.
echo If both pods show "1/1 Running" status, your deployment is successful.
echo If the frontend pod is in CrashLoopBackOff status, check the logs with:
echo   kubectl logs ^<frontend-pod-name^> -n lingua-app
echo.
pause