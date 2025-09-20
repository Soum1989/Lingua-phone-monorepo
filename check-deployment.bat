@echo off
color 0A
title Lingua Phone - Check Deployment

echo ========================================
echo Lingua Phone - Check Deployment
echo ========================================
echo.

echo 1. Getting deployment information...
echo ==========================
kubectl get deployment lingua-frontend -n lingua-app -o yaml
echo.

echo 2. Getting service information...
echo =======================
kubectl get service lingua-frontend-service -n lingua-app -o yaml
echo.

echo 3. Getting configmap information...
echo ========================
kubectl get configmap lingua-config -n lingua-app -o yaml
echo.

echo ========================================
echo Deployment check complete!
echo ========================================
pause