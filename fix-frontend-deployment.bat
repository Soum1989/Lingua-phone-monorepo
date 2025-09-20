@echo off
color 0A
title Lingua Phone - Fix Frontend Deployment

echo ========================================
echo Lingua Phone - Fix Frontend Deployment
echo ========================================
echo.

echo 1. Current frontend pod status...
echo =====================
kubectl get pods -l app=lingua-frontend -n lingua-app
echo.

echo 2. Deleting all frontend pods to force recreation...
echo =============================
kubectl delete pods -l app=lingua-frontend -n lingua-app
echo.

echo 3. Waiting 30 seconds for pods to be recreated...
echo =============================
timeout /t 30 /nobreak
echo.

echo 4. Checking new pod status...
echo ==================
kubectl get pods -l app=lingua-frontend -n lingua-app
echo.

echo 5. Waiting another 30 seconds for pods to initialize...
echo =============================
timeout /t 30 /nobreak
echo.

echo 6. Final pod status check...
echo ==================
kubectl get pods -l app=lingua-frontend -n lingua-app
echo.

echo 7. Frontend service status...
echo ==================
kubectl get service lingua-frontend-service -n lingua-app
echo.

echo ========================================
echo Frontend deployment fix attempt complete!
echo Please run comprehensive-status-check.bat to verify the status
echo ========================================
pause