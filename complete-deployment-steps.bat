@echo off
echo Lingua Phone - GKE Deployment Script
echo ====================================
echo.

echo This script will execute all the necessary steps to deploy the application to GKE.
echo.

echo Step 1: Creating namespace 'lingua-app'
echo Command: kubectl create namespace lingua-app
kubectl create namespace lingua-app
if %errorlevel% neq 0 (
    echo Error: Failed to create namespace
    pause
    exit /b 1
)
echo Namespace 'lingua-app' created successfully.
echo.

echo Step 2: Creating secret for Google Cloud credentials
echo Command: kubectl create secret generic google-cloud-key --from-file=key.json=packages/backend/keys/service-account.json --namespace=lingua-app
kubectl create secret generic google-cloud-key --from-file=key.json=packages/backend/keys/service-account.json --namespace=lingua-app
if %errorlevel% neq 0 (
    echo Error: Failed to create secret
    pause
    exit /b 1
)
echo Secret 'google-cloud-key' created successfully.
echo.

echo Step 3: Building Docker images
echo Command: docker build -t lingua-backend:latest -f docker/backend.Dockerfile .
docker build -t lingua-backend:latest -f docker/backend.Dockerfile .
if %errorlevel% neq 0 (
    echo Error: Failed to build backend image
    pause
    exit /b 1
)
echo Backend image built successfully.
echo.

echo Command: docker build -t lingua-frontend:latest -f docker/frontend.Dockerfile .
docker build -t lingua-frontend:latest -f docker/frontend.Dockerfile .
if %errorlevel% neq 0 (
    echo Error: Failed to build frontend image
    pause
    exit /b 1
)
echo Frontend image built successfully.
echo.

echo Step 4: Deploying application to GKE
echo Command: kubectl apply -k k8s/
kubectl apply -k k8s/
if %errorlevel% neq 0 (
    echo Error: Failed to deploy application
    pause
    exit /b 1
)
echo Application deployed successfully.
echo.

echo Step 5: Verifying deployment
echo Command: kubectl get pods -n lingua-app
kubectl get pods -n lingua-app
echo.

echo Deployment completed successfully!
echo.
echo To check the status of your services, run:
echo   kubectl get services -n lingua-app
echo.
echo To check the external IP for accessing the application, look for the frontend service.
echo.
pause