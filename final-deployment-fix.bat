@echo off
color 0A
title Lingua Phone - Final Deployment Fix

echo ========================================
echo Lingua Phone - Final Deployment Fix
echo ========================================
echo.

echo This script will:
echo 1. Get cluster credentials
echo 2. Build and push updated Docker images
echo 3. Apply updated Kubernetes configurations
echo 4. Delete existing pods to force recreation
echo 5. Check the status of the pods
echo.

echo Press any key to continue or Ctrl+C to cancel...
pause >nul
echo.

echo 1. Getting cluster credentials...
echo ================================
gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to get cluster credentials.
    echo Please make sure you're authenticated with Google Cloud.
    echo Run: gcloud auth login
    pause
    exit /b 1
)
echo.

echo 2. Building backend image...
echo ===========================
docker build -t gcr.io/lingua-phone/lingua-backend:latest -f docker/backend.Dockerfile .
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to build backend image.
    pause
    exit /b 1
)
echo.

echo 3. Building frontend image...
echo ============================
docker build -t gcr.io/lingua-phone/lingua-frontend:latest -f docker/frontend-k8s.Dockerfile .
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to build frontend image.
    pause
    exit /b 1
)
echo.

echo 4. Pushing backend image...
echo ==========================
docker push gcr.io/lingua-phone/lingua-backend:latest
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to push backend image.
    pause
    exit /b 1
)
echo.

echo 5. Pushing frontend image...
echo ===========================
docker push gcr.io/lingua-phone/lingua-frontend:latest
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to push frontend image.
    pause
    exit /b 1
)
echo.

echo 6. Applying updated Kubernetes configurations...
echo ==============================================
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to apply Kubernetes configurations.
    pause
    exit /b 1
)
echo.

echo 7. Deleting existing pods to force recreation...
echo ==============================================
kubectl delete pods -n lingua-app --all
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to delete existing pods.
    pause
    exit /b 1
)
echo.

echo 8. Waiting for pods to be recreated (30 seconds)...
echo =================================================
timeout /t 30 /nobreak >nul
echo.

echo 9. Checking pod status...
echo ========================
kubectl get pods -n lingua-app
echo.

echo 10. Checking service status...
echo =============================
kubectl get services -n lingua-app
echo.

echo ========================================
echo Deployment process completed!
echo ========================================
echo.
echo Please check the pod status above.
echo.
echo If both pods show "1/1 Running" status, your application is successfully deployed.
echo.
echo To access your application:
echo 1. Note the EXTERNAL-IP from the service status above
echo 2. Open a web browser and navigate to http://^<EXTERNAL-IP^>
echo.
echo If the frontend pod is still showing CrashLoopBackOff:
echo 1. Check the logs: kubectl logs ^<frontend-pod-name^> -n lingua-app --previous
echo 2. Check pod description: kubectl describe pod ^<frontend-pod-name^> -n lingua-app
echo.
pause