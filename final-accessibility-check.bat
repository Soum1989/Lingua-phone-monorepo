@echo off
color 0A
title Lingua Phone - Final Accessibility Check

echo ========================================
echo Lingua Phone - Final Accessibility Check
echo ========================================
echo.

echo 1. Checking if kubectl is available...
echo ==========================
kubectl version --client
if %errorlevel% neq 0 (
    echo Error: kubectl not found or not working
    pause
    exit /b 1
)
echo.

echo 2. Checking cluster connectivity...
echo ======================
kubectl cluster-info
if %errorlevel% neq 0 (
    echo Error: Cannot connect to cluster
    pause
    exit /b 1
)
echo.

echo 3. Checking pod status...
echo =================
kubectl get pods -n lingua-app
echo.

echo 4. Checking service status...
echo ===================
kubectl get services -n lingua-app
echo.

echo 5. Getting frontend service external IP...
echo ==============================
kubectl get service lingua-frontend-service -n lingua-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
echo.
echo.

echo 6. Testing application accessibility...
echo ==========================
curl -v http://34.45.239.154
echo.

echo ========================================
echo Final accessibility check complete!
echo ========================================
echo.
echo If you see HTML content above, your application is accessible.
echo If you see connection errors, the frontend pods may still be having issues.
echo.
pause