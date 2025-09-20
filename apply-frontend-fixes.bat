@echo off
color 0A
title Lingua Phone - Apply Frontend Fixes

echo ========================================
echo Lingua Phone - Apply Frontend Fixes
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
echo 2. Applying updated backend service configuration...
echo ===============================================
kubectl apply -f k8s/backend-service.yaml
if %errorlevel% neq 0 (
    echo ERROR: Failed to apply backend service configuration.
    pause
    exit /b 1
)

echo.
echo 3. Applying updated frontend deployment configuration...
echo ===================================================
kubectl apply -f k8s/frontend-deployment.yaml
if %errorlevel% neq 0 (
    echo ERROR: Failed to apply frontend deployment configuration.
    pause
    exit /b 1
)

echo.
echo 4. Restarting deployments...
echo =========================
kubectl rollout restart deployment lingua-frontend -n lingua-app
if %errorlevel% neq 0 (
    echo ERROR: Failed to restart frontend deployment.
    pause
    exit /b 1
)

kubectl rollout restart deployment lingua-backend -n lingua-app
if %errorlevel% neq 0 (
    echo ERROR: Failed to restart backend deployment.
    pause
    exit /b 1
)

echo.
echo 5. Waiting for pods to restart (30 seconds)...
echo ==========================================
timeout /t 30 /nobreak >nul

echo.
echo 6. Checking status...
echo ==================
kubectl get pods -n lingua-app

echo.
echo ========================================
echo Frontend fixes applied successfully!
echo ========================================
echo.
echo Please check the pod status above.
echo.
echo Run 'check-frontend-logs.bat' to verify the logs.
echo Run 'simple-status-check.bat' for a full status check.
echo.
pause