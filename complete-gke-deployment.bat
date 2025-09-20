@echo off
echo Complete GKE Deployment for Lingua Phone
echo ========================================

echo 1. Verifying Google Cloud authentication...
gcloud auth list
if %errorlevel% neq 0 (
    echo Error: Not authenticated with Google Cloud
    exit /b 1
)

echo 2. Setting project...
gcloud config set project lingua-phone
if %errorlevel% neq 0 (
    echo Error: Failed to set project
    exit /b 1
)

echo 3. Building Docker images...
echo Building backend image...
docker build -t gcr.io/lingua-phone/lingua-backend:latest -f docker/backend.Dockerfile .
if %errorlevel% neq 0 (
    echo Error: Failed to build backend image
    exit /b 1
)

echo Building frontend image...
docker build -t gcr.io/lingua-phone/lingua-frontend:latest -f docker/frontend-k8s.Dockerfile .
if %errorlevel% neq 0 (
    echo Error: Failed to build frontend image
    exit /b 1
)

echo 4. Pushing images to Google Container Registry...
echo Pushing backend image...
docker push gcr.io/lingua-phone/lingua-backend:latest
if %errorlevel% neq 0 (
    echo Error: Failed to push backend image
    exit /b 1
)

echo Pushing frontend image...
docker push gcr.io/lingua-phone/lingua-frontend:latest
if %errorlevel% neq 0 (
    echo Error: Failed to push frontend image
    exit /b 1
)

echo 5. Creating namespace if it doesn't exist...
kubectl create namespace lingua-app 2>nul
echo Namespace 'lingua-app' is ready.

echo 6. Creating secret for Google Cloud credentials...
kubectl create secret generic google-cloud-key --from-file=key.json=packages/backend/keys/service-account.json --namespace=lingua-app
if %errorlevel% neq 0 (
    echo Warning: Secret might already exist, continuing...
)

echo 7. Deploying application to GKE...
kubectl apply -k k8s/
if %errorlevel% neq 0 (
    echo Error: Failed to deploy application
    exit /b 1
)

echo 8. Waiting for deployments to be ready...
kubectl rollout status deployment/lingua-backend -n lingua-app
kubectl rollout status deployment/lingua-frontend -n lingua-app

echo 9. Checking pod status...
kubectl get pods -n lingua-app

echo.
echo Deployment completed successfully!
echo.
echo To check the status of your services, run:
echo   kubectl get services -n lingua-app
echo.
echo To access your application, you'll need the external IP of the frontend service once it's assigned.