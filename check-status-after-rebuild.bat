@echo off
color 0A
title Lingua Phone - Check Status After Rebuild

echo ========================================
echo Lingua Phone - Check Status After Rebuild
echo ========================================
echo.

echo 1. Checking pod status...
echo =================
kubectl get pods -n lingua-app
echo.

echo 2. Checking service status...
echo ===================
kubectl get services -n lingua-app
echo.

echo 3. Checking if application is accessible...
echo ==============================
curl -v http://34.45.239.154
echo.

echo ========================================
echo Status check complete!
echo ========================================
pause