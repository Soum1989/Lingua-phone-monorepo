@echo off
echo Redeploying application to GKE cluster...
echo ======================================

echo 1. Getting cluster credentials...
gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a
if %errorlevel% neq 0 (
    echo Failed to get cluster credentials.
    exit /b 1
)

echo 2. Building and pushing Docker images...
echo Building backend image...
docker build -t gcr.io/lingua-phone/lingua-backend:latest -f docker/backend.Dockerfile .
if %errorlevel% neq 0 (
    echo Failed to build backend image.
    exit /b 1
)

echo Building frontend image with Kubernetes-specific configuration...
docker build -t gcr.io/lingua-phone/lingua-frontend:latest -f docker/frontend-k8s.Dockerfile .
if %errorlevel% neq 0 (
    echo Failed to build frontend image.
    exit /b 1
)

echo Pushing backend image...
docker push gcr.io/lingua-phone/lingua-backend:latest
if %errorlevel% neq 0 (
    echo Failed to push backend image.
    exit /b 1
)

echo Pushing frontend image...
docker push gcr.io/lingua-phone/lingua-frontend:latest
if %errorlevel% neq 0 (
    echo Failed to push frontend image.
    exit /b 1
)

echo 3. Applying Kubernetes manifests...
kubectl apply -k k8s/
if %errorlevel% neq 0 (
    echo Failed to apply Kubernetes manifests.
    exit /b 1
)

echo 4. Waiting for deployments to be ready...
kubectl rollout status deployment/lingua-backend -n lingua-app
kubectl rollout status deployment/lingua-frontend -n lingua-app

echo 5. Checking pod status...
kubectl get pods -n lingua-app

echo.
echo Redeployment completed!
echo.
echo To check the status of your services, run:
echo   kubectl get services -n lingua-app
echo.
echo To access your application, you'll need the external IP of the frontend service once it's assigned.