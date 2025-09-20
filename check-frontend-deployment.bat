@echo off
color 0A
title Lingua Phone - Check Frontend Deployment

echo ========================================
echo Lingua Phone - Check Frontend Deployment
echo ========================================
echo.

echo 1. Getting frontend deployment details...
echo =============================
kubectl get deployment lingua-frontend -n lingua-app -o wide
echo.

echo 2. Describing frontend deployment...
echo =============================
kubectl describe deployment lingua-frontend -n lingua-app
echo.

echo 3. Checking frontend pod status...
echo ==================
kubectl get pods -l app=lingua-frontend -n lingua-app
echo.

echo 4. Checking frontend service...
echo ==================
kubectl get service lingua-frontend-service -n lingua-app
echo.

echo ========================================
echo Frontend deployment check complete!
echo ========================================
pause