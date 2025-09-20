@echo off
color 0A
title Lingua Phone - Fix Commands

echo =====================================================
echo Lingua Phone Application - Manual Fix Commands
echo =====================================================
echo.
echo Please run these commands one by one in your terminal:
echo.

echo 1. Get cluster credentials:
echo    gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a
echo.

echo 2. Build backend image:
echo    docker build -t gcr.io/lingua-phone/lingua-backend:latest -f docker/backend.Dockerfile .
echo.

echo 3. Build frontend image with Kubernetes-specific configuration:
echo    docker build -t gcr.io/lingua-phone/lingua-frontend:latest -f docker/frontend-k8s.Dockerfile .
echo.

echo 4. Push backend image:
echo    docker push gcr.io/lingua-phone/lingua-backend:latest
echo.

echo 5. Push frontend image:
echo    docker push gcr.io/lingua-phone/lingua-frontend:latest
echo.

echo 6. Delete existing pods to force recreation:
echo    kubectl delete pods -n lingua-app --all
echo.

echo 7. Check pod status (run multiple times until pods are Running):
echo    kubectl get pods -n lingua-app
echo.

echo 8. Get services to find the external IP:
echo    kubectl get services -n lingua-app
echo.

echo =====================================================
echo IMPORTANT: Run these commands one by one in your terminal
echo Do not close this window until you've run all commands
echo =====================================================
echo.
echo Press any key to close this window...
pause >nul