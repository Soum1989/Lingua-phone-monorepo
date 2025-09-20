@echo off
color 0A
title Lingua Phone - Check Deployment Status

echo ========================================
echo Lingua Phone - Check Deployment Status
echo ========================================
echo.

echo 1. Getting cluster credentials...
echo ================================
gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a
echo.

echo 2. Checking pod status...
echo =======================
kubectl get pods -n lingua-app
echo.

echo 3. Checking service status...
echo ===========================
kubectl get services -n lingua-app
echo.

echo 4. If frontend pod is in CrashLoopBackOff, checking logs...
echo =========================================================
FOR /F "tokens=1" %%i IN ('kubectl get pods -n lingua-app ^| findstr lingua-frontend') DO set FRONTEND_POD=%%i
echo Frontend pod name: %FRONTEND_POD%
if defined FRONTEND_POD (
    echo.
    echo Frontend pod logs:
    echo =================
    kubectl logs %FRONTEND_POD% -n lingua-app --tail=20
)
echo.

echo ========================================
echo Check completed!
echo ========================================
echo.
pause