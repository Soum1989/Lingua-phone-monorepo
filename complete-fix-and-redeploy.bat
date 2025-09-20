@echo off
color 0A
title Lingua Phone - Complete Fix and Redeploy

echo =================================================
echo Lingua Phone - Complete Fix and Redeploy
echo =================================================
echo.

echo 1. Getting cluster credentials...
echo ================================
gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a
if %errorlevel% neq 0 (
    echo ERROR: Failed to get cluster credentials.
    pause
    exit /b 1
)

echo.
echo 2. Building frontend image with latest fixes...
echo ===========================================
docker build -t gcr.io/lingua-phone/lingua-frontend:latest -f docker/frontend-k8s.Dockerfile .
if %errorlevel% neq 0 (
    echo ERROR: Failed to build frontend image.
    pause
    exit /b 1
)

echo.
echo 3. Building backend image...
echo =========================
docker build -t gcr.io/lingua-phone/lingua-backend:latest -f docker/backend.Dockerfile .
if %errorlevel% neq 0 (
    echo ERROR: Failed to build backend image.
    pause
    exit /b 1
)

echo.
echo 4. Pushing images to Google Container Registry...
echo ==============================================
docker push gcr.io/lingua-phone/lingua-frontend:latest
if %errorlevel% neq 0 (
    echo ERROR: Failed to push frontend image.
    pause
    exit /b 1
)

docker push gcr.io/lingua-phone/lingua-backend:latest
if %errorlevel% neq 0 (
    echo ERROR: Failed to push backend image.
    pause
    exit /b 1
)

echo.
echo 5. Applying updated Kubernetes configurations...
echo =============================================
kubectl apply -f k8s/namespace.yaml
if %errorlevel% neq 0 (
    echo ERROR: Failed to apply namespace configuration.
    pause
    exit /b 1
)

kubectl apply -f k8s/backend-service.yaml
if %errorlevel% neq 0 (
    echo ERROR: Failed to apply backend service configuration.
    pause
    exit /b 1
)

kubectl apply -f k8s/frontend-deployment.yaml
if %errorlevel% neq 0 (
    echo ERROR: Failed to apply frontend deployment configuration.
    pause
    exit /b 1
)

kubectl apply -f k8s/backend-deployment.yaml
if %errorlevel% neq 0 (
    echo ERROR: Failed to apply backend deployment configuration.
    pause
    exit /b 1
)

echo.
echo 6. Restarting deployments to ensure new configuration is used...
echo ==============================================================
kubectl rollout restart deployment lingua-frontend -n lingua-app
if %errorlevel% neq 0 (
    echo ERROR: Failed to restart frontend deployment.
    pause
    exit /b 1
)

kubectl rollout restart deployment lingua-backend -n lingua-app
if %errorlevel% neq 0 (
    echo ERROR: Failed to restart backend deployment.
    pause
    exit /b 1
)

echo.
echo 7. Waiting for pods to be recreated (60 seconds)...
echo ================================================
timeout /t 60 /nobreak >nul

echo.
echo 8. Checking pod status...
echo ========================
kubectl get pods -n lingua-app

echo.
echo =================================================
echo Complete fix and redeployment process completed!
echo =================================================
echo.
echo Please check the pod status above.
echo.
echo If both pods show "1/1 Running" status, your application should be accessible.
echo.
echo To access your application:
echo   External IP: http://34.45.239.154
echo.
echo If issues persist, check the logs:
echo   kubectl logs -l app=lingua-frontend -n lingua-app
echo   kubectl logs -l app=lingua-backend -n lingua-app
echo.
pause