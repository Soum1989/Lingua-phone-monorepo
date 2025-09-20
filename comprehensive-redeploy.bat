@echo off
echo Comprehensive redeployment script for Lingua Phone application
echo =============================================================
echo This script will rebuild Docker images, push them to GCR, and redeploy to GKE
echo All output will be saved to redeployment-log.txt
echo.

> redeployment-log.txt echo Starting comprehensive redeployment at %date% %time%

echo 1. Rebuilding Docker images...
echo 1. Rebuilding Docker images... >> redeployment-log.txt
docker build -t gcr.io/lingua-phone/lingua-backend:latest -f docker/backend.Dockerfile . >> redeployment-log.txt 2>&1
if %errorlevel% neq 0 (
    echo Error building backend Docker image
    echo Error building backend Docker image >> redeployment-log.txt
    exit /b %errorlevel%
)

docker build -t gcr.io/lingua-phone/lingua-frontend:latest -f docker/frontend.Dockerfile . >> redeployment-log.txt 2>&1
if %errorlevel% neq 0 (
    echo Error building frontend Docker image
    echo Error building frontend Docker image >> redeployment-log.txt
    exit /b %errorlevel%
)

echo 2. Pushing images to Google Container Registry...
echo 2. Pushing images to Google Container Registry... >> redeployment-log.txt
docker push gcr.io/lingua-phone/lingua-backend:latest >> redeployment-log.txt 2>&1
if %errorlevel% neq 0 (
    echo Error pushing backend Docker image
    echo Error pushing backend Docker image >> redeployment-log.txt
    exit /b %errorlevel%
)

docker push gcr.io/lingua-phone/lingua-frontend:latest >> redeployment-log.txt 2>&1
if %errorlevel% neq 0 (
    echo Error pushing frontend Docker image
    echo Error pushing frontend Docker image >> redeployment-log.txt
    exit /b %errorlevel%
)

echo 3. Deleting existing deployments...
echo 3. Deleting existing deployments... >> redeployment-log.txt
kubectl delete deployment lingua-frontend -n lingua-app >> redeployment-log.txt 2>&1
kubectl delete deployment lingua-backend -n lingua-app >> redeployment-log.txt 2>&1

echo 4. Redeploying to GKE...
echo 4. Redeploying to GKE... >> redeployment-log.txt
kubectl apply -k k8s/ >> redeployment-log.txt 2>&1

echo 5. Waiting for pods to start...
echo 5. Waiting for pods to start... >> redeployment-log.txt
timeout /t 60 /nobreak >nul

echo 6. Checking deployment status...
echo 6. Checking deployment status... >> redeployment-log.txt
kubectl get pods -n lingua-app >> redeployment-log.txt 2>&1

echo.
echo Deployment process completed. Check redeployment-log.txt for details.
echo.