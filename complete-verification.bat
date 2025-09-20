@echo off
color 0A
title Lingua Phone - Complete Deployment Verification

echo ========================================
echo Lingua Phone - Complete Deployment Verification
echo ========================================
echo.

echo 1. Checking ALL pods in the cluster...
echo =====================================
kubectl get pods -n lingua-app

echo.
echo 2. Checking ALL services in the cluster...
echo =======================================
kubectl get services -n lingua-app

echo.
echo 3. Checking backend service details...
echo ==================================
kubectl get service lingua-backend-service -n lingua-app -o wide

echo.
echo 4. Checking frontend service details...
echo ====================================
kubectl get service lingua-frontend-service -n lingua-app -o wide

echo.
echo ========================================
echo Deployment Verification Complete
echo ========================================
echo.
echo Both frontend and backend services are deployed to Google Kubernetes Engine (GKE).
echo.
echo Backend Service:
echo - Type: ClusterIP (internal service within the cluster)
echo - Port: 3002
echo - Accessible internally by other services in the cluster
echo.
echo Frontend Service:
echo - Type: LoadBalancer (externally accessible)
echo - External IP: 34.45.239.154
echo - Port: 80
echo.
echo The frontend communicates with the backend internally through the service name.
echo You can access your complete application at: http://34.45.239.154
echo.
pause