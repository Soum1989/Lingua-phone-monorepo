@echo off
echo ========================================
echo Lingua Phone - GKE Deployment Verification
echo ========================================

echo.
echo 1. Checking cluster connectivity...
kubectl cluster-info

echo.
echo 2. Checking pod status...
kubectl get pods -n lingua-app

echo.
echo 3. Checking service status...
kubectl get svc -n lingua-app

echo.
echo 4. Checking frontend service details...
kubectl describe svc lingua-frontend-service -n lingua-app

echo.
echo 5. Application should be accessible at: http://34.45.239.154
echo.
echo Deployment verification complete!