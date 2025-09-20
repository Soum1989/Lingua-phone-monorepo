@echo off
color 0A
title Lingua Phone - Application Status Check

echo ========================================
echo     LINGUA PHONE APPLICATION STATUS
echo ========================================
echo.

echo Checking if the Lingua Phone application is accessible...
echo.

echo 1. Testing connection to the application...
echo =================================
curl -v http://34.45.239.154
echo.

echo 2. Checking pod status...
echo =================
kubectl get pods -n lingua-app
echo.

echo 3. Checking service status...
echo ===================
kubectl get services -n lingua-app
echo.

echo ========================================
echo           STATUS CHECK COMPLETE
echo ========================================
echo.
echo If you see HTML content in step 1, your application is working!
echo If you see connection errors, the frontend pods may still be having issues.
echo.
echo To fix frontend pod issues:
echo 1. Run "rebuild-and-push-frontend.bat"
echo 2. Wait 30 seconds for pods to restart
echo 3. Run this script again to check status
echo.
pause