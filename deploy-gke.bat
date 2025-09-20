@echo off
setlocal

REM Variables
set PROJECT_ID=lingua-phone
set CLUSTER_NAME=lingua-cluster
set ZONE=us-central1-a
set REGION=us-central1

echo Starting deployment to GKE...

REM Authenticate with Google Cloud (if not already done)
REM gcloud auth login

REM Set the project
REM gcloud config set project %PROJECT_ID%

REM Create GKE cluster (if it doesn't exist)
echo Creating GKE cluster (if it doesn't exist)...
gcloud container clusters create %CLUSTER_NAME% ^
    --zone=%ZONE% ^
    --num-nodes=3 ^
    --machine-type=e2-medium ^
    --enable-autoscaling ^
    --min-nodes=1 ^
    --max-nodes=5 ^
    --enable-autorepair ^
    --enable-autoupgrade

REM Get credentials for the cluster
echo Getting cluster credentials...
gcloud container clusters get-credentials %CLUSTER_NAME% --zone=%ZONE%

REM Build Docker images
echo Building Docker images...
docker build -t lingua-backend:latest -f docker/backend.Dockerfile .
docker build -t lingua-frontend:latest -f docker/frontend.Dockerfile .

REM Tag images for Google Container Registry
echo Tagging images for GCR...
docker tag lingua-backend:latest gcr.io/%PROJECT_ID%/lingua-backend:latest
docker tag lingua-frontend:latest gcr.io/%PROJECT_ID%/lingua-frontend:latest

REM Push images to Google Container Registry
echo Pushing images to GCR...
docker push gcr.io/%PROJECT_ID%/lingua-backend:latest
docker push gcr.io/%PROJECT_ID%/lingua-frontend:latest

REM Deploy to GKE
echo Deploying to GKE...
kubectl apply -k k8s/

REM Wait for deployments to be ready
echo Waiting for deployments to be ready...
kubectl wait --for=condition=available --timeout=600s deployment/lingua-backend -n lingua-app
kubectl wait --for=condition=available --timeout=600s deployment/lingua-frontend -n lingua-app

REM Get service information
echo Getting service information...
kubectl get services -n lingua-app

echo Deployment completed successfully!
echo Frontend service will be accessible via the external IP shown above.

pause
