@echo off
setlocal

set PROJECT_ID=lingua-phone
set IMAGE_NAME=lingua-frontend
set TAG=latest

echo Building frontend Docker image...
docker build -t gcr.io/%PROJECT_ID%/%IMAGE_NAME%:%TAG% -f docker/frontend-k8s.Dockerfile .

if %errorlevel% neq 0 (
    echo Error: Failed to build Docker image
    exit /b 1
)

echo Pushing image to Google Container Registry...
docker push gcr.io/%PROJECT_ID%/%IMAGE_NAME%:%TAG%

if %errorlevel% neq 0 (
    echo Error: Failed to push Docker image
    exit /b 1
)

echo Deploying to GKE...
kubectl apply -f k8s/frontend-deployment.yaml

if %errorlevel% neq 0 (
    echo Error: Failed to deploy to GKE
    exit /b 1
)

echo Deployment completed successfully!
echo Checking pod status...
kubectl get pods -n lingua-app

pause