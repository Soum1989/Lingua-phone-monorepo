@echo off
echo ========================================
echo Rebuilding and Redeploying to GKE Cluster
echo ========================================

echo.
echo This script will:
echo 1. Activate Miniconda environment
echo 2. Build and push updated Docker images
echo 3. Delete existing pods to force recreation
echo 4. Check the status of the pods
echo.

echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo 1. Getting cluster credentials...
gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a
if %errorlevel% neq 0 (
    echo Failed to get cluster credentials.
    pause
    exit /b 1
)

echo.
echo 2. Building backend image...
docker build -t gcr.io/lingua-phone/lingua-backend:latest -f docker/backend.Dockerfile .
if %errorlevel% neq 0 (
    echo Failed to build backend image.
    pause
    exit /b 1
)

echo.
echo 3. Building frontend image with Kubernetes-specific configuration...
docker build -t gcr.io/lingua-phone/lingua-frontend:latest -f docker/frontend-k8s.Dockerfile .
if %errorlevel% neq 0 (
    echo Failed to build frontend image.
    pause
    exit /b 1
)

echo.
echo 4. Pushing backend image...
docker push gcr.io/lingua-phone/lingua-backend:latest
if %errorlevel% neq 0 (
    echo Failed to push backend image.
    pause
    exit /b 1
)

echo.
echo 5. Pushing frontend image...
docker push gcr.io/lingua-phone/lingua-frontend:latest
if %errorlevel% neq 0 (
    echo Failed to push frontend image.
    pause
    exit /b 1
)

echo.
echo 6. Deleting existing pods to force recreation with new images...
kubectl delete pods -n lingua-app --all
if %errorlevel% neq 0 (
    echo Failed to delete existing pods.
    pause
    exit /b 1
)

echo.
echo 7. Waiting for pods to be recreated...
timeout /t 30 /nobreak >nul

echo.
echo 8. Checking pod status...
kubectl get pods -n lingua-app

echo.
echo ========================================
echo Rebuild and redeployment process completed
echo ========================================
echo.
echo Please check the pod status above. The pods should now be running.
echo If they're still showing CrashLoopBackOff, please check the pod logs:
echo   kubectl logs ^<frontend-pod-name^> -n lingua-app
echo.
echo To get the external IP of your application:
echo   kubectl get services -n lingua-app
echo.
pause