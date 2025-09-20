@echo off
color 0A
title Lingua Phone - Complete Deployment

echo ========================================
echo     LINGUA PHONE COMPLETE DEPLOYMENT
echo ========================================
echo.

echo This script will attempt to complete the deployment of the Lingua Phone application.
echo.

echo 1. Building and pushing frontend image...
echo =============================
docker build -t gcr.io/lingua-phone/lingua-frontend:latest -f docker/frontend-k8s.Dockerfile .
if %errorlevel% neq 0 (
    echo ERROR: Failed to build frontend image
    pause
    exit /b %errorlevel%
)

echo.
echo 2. Pushing frontend image to Google Container Registry...
echo ===============================================
gcloud auth configure-docker
docker push gcr.io/lingua-phone/lingua-frontend:latest
if %errorlevel% neq 0 (
    echo ERROR: Failed to push frontend image
    pause
    exit /b %errorlevel%
)

echo.
echo 3. Deleting existing frontend pods to force recreation...
echo ===============================================
kubectl delete pod -l app=lingua-frontend -n lingua-app
if %errorlevel% neq 0 (
    echo ERROR: Failed to delete frontend pods
    pause
    exit /b %errorlevel%
)

echo.
echo 4. Waiting for pods to restart...
echo =======================
timeout /t 30

echo.
echo 5. Checking pod status...
echo ================
kubectl get pods -n lingua-app

echo.
echo 6. Testing application access...
echo =======================
curl -v http://34.45.239.154

echo.
echo ========================================
echo           DEPLOYMENT COMPLETE
echo ========================================
echo.
echo Please check the output above to see if the deployment was successful.
echo.
echo If the application is still not accessible, please run the diagnostic scripts:
echo - diagnose-frontend-issues.bat
echo - check-frontend-image.bat
echo - cluster-resource-check.bat
echo.
echo The application should be accessible at: http://34.45.239.154
echo.
pause