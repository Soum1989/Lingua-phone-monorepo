@echo off
setlocal

REM Variables
set PROJECT_ID=lingua-phone
set CLUSTER_NAME=lingua-cluster
set ZONE=us-central1-a

echo ==========================================
echo Lingua Phone - Complete GKE Deployment
echo ==========================================

REM Step 1: Authenticate with Google Cloud (if needed)
echo Step 1: Checking Google Cloud authentication...
gcloud auth list --filter=status:ACTIVE --format="value(account)" >nul 2>&1
if %errorlevel% neq 0 (
    echo Please authenticate with Google Cloud:
    gcloud auth login
    if %errorlevel% neq 0 (
        echo Failed to authenticate with Google Cloud.
        exit /b 1
    )
)

REM Step 2: Set the project
echo Step 2: Setting Google Cloud project...
gcloud config set project %PROJECT_ID%
if %errorlevel% neq 0 (
    echo Failed to set Google Cloud project.
    exit /b 1
)

REM Step 3: Update configuration files
echo Step 3: Updating configuration files...
call UPDATE_GKE_CONFIG.bat %PROJECT_ID%
if %errorlevel% neq 0 (
    echo Failed to update configuration files.
    exit /b 1
)

REM Step 4: Build Docker images
echo Step 4: Building Docker images...
echo Building backend image...
docker build -t lingua-backend:latest -f docker/backend.Dockerfile .
if %errorlevel% neq 0 (
    echo Failed to build backend Docker image.
    exit /b 1
)

echo Building frontend image with Kubernetes-specific configuration...
docker build -t lingua-frontend:latest -f docker/frontend-k8s.Dockerfile .
if %errorlevel% neq 0 (
    echo Failed to build frontend Docker image.
    exit /b 1
)

REM Step 5: Tag images for Google Container Registry
echo Step 5: Tagging images for Google Container Registry...
docker tag lingua-backend:latest gcr.io/%PROJECT_ID%/lingua-backend:latest
if %errorlevel% neq 0 (
    echo Failed to tag backend image.
    exit /b 1
)

docker tag lingua-frontend:latest gcr.io/%PROJECT_ID%/lingua-frontend:latest
if %errorlevel% neq 0 (
    echo Failed to tag frontend image.
    exit /b 1
)

REM Step 6: Push images to Google Container Registry
echo Step 6: Pushing images to Google Container Registry...
echo Pushing backend image...
docker push gcr.io/%PROJECT_ID%/lingua-backend:latest
if %errorlevel% neq 0 (
    echo Failed to push backend image.
    exit /b 1
)

echo Pushing frontend image...
docker push gcr.io/%PROJECT_ID%/lingua-frontend:latest
if %errorlevel% neq 0 (
    echo Failed to push frontend image.
    exit /b 1
)

REM Step 7: Create Kubernetes secret for Google Cloud credentials
echo Step 7: Creating Kubernetes secret for Google Cloud credentials...
REM Note: You need to have your service account key file at packages/backend/keys/service-account.json
kubectl create secret generic google-cloud-key --from-file=key.json=packages/backend/keys/service-account.json --namespace=lingua-app 2>nul
if %errorlevel% neq 0 (
    echo Secret may already exist or failed to create. Continuing...
)

REM Step 8: Deploy to GKE
echo Step 8: Deploying to GKE...
kubectl apply -k k8s/
if %errorlevel% neq 0 (
    echo Failed to deploy to GKE.
    exit /b 1
)

REM Step 9: Wait for deployments to be ready
echo Step 9: Waiting for deployments to be ready...
kubectl wait --for=condition=available --timeout=600s deployment/lingua-backend -n lingua-app 2>nul
if %errorlevel% neq 0 (
    echo Backend deployment may not be ready yet. Continuing...
)

kubectl wait --for=condition=available --timeout=600s deployment/lingua-frontend -n lingua-app 2>nul
if %errorlevel% neq 0 (
    echo Frontend deployment may not be ready yet. Continuing...
)

REM Step 10: Get service information
echo Step 10: Getting service information...
kubectl get services -n lingua-app

echo ==========================================
echo Deployment completed successfully!
echo ==========================================
echo Next steps:
echo 1. Wait a few minutes for the LoadBalancer to get an external IP
echo 2. Run 'kubectl get services -n lingua-app' to check the external IP
echo 3. Access your application using the external IP of the frontend service
echo ==========================================

pause