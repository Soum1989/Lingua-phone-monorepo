@echo off
color 0A
title Lingua Phone - Check Backend Service

echo ========================================
echo Lingua Phone - Check Backend Service
echo ========================================
echo.

echo 1. Getting backend deployment details...
echo =============================
kubectl get deployment lingua-backend -n lingua-app -o wide
echo.

echo 2. Checking backend pod status...
echo ==================
kubectl get pods -l app=lingua-backend -n lingua-app
echo.

echo 3. Checking backend service...
echo ==================
kubectl get service lingua-backend-service -n lingua-app
echo.

echo 4. Getting backend pod logs...
echo ==================
kubectl logs -l app=lingua-backend -n lingua-app --tail=20
echo.

echo ========================================
echo Backend service check complete!
echo ========================================
pause