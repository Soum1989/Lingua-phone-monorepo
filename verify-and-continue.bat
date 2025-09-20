@echo off
echo Verifying Lingua Phone Deployment Status
echo ======================================
echo.

echo Checking if namespace 'lingua-app' exists...
kubectl get namespace lingua-app >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Namespace 'lingua-app' exists
) else (
    echo ✗ Namespace 'lingua-app' does not exist
    echo.
    echo Creating namespace 'lingua-app'...
    kubectl create namespace lingua-app
    if %errorlevel% == 0 (
        echo ✓ Namespace 'lingua-app' created successfully
    ) else (
        echo ✗ Failed to create namespace 'lingua-app'
        echo.
        echo Please try manually:
        echo   kubectl create namespace lingua-app
        pause
        exit /b 1
    )
)

echo.
echo Checking if secret 'google-cloud-key' exists in namespace 'lingua-app'...
kubectl get secret google-cloud-key --namespace=lingua-app >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Secret 'google-cloud-key' exists in namespace 'lingua-app'
) else (
    echo ✗ Secret 'google-cloud-key' does not exist in namespace 'lingua-app'
    echo.
    echo Creating secret 'google-cloud-key'...
    kubectl create secret generic google-cloud-key --from-file=key.json=packages/backend/keys/service-account.json --namespace=lingua-app
    if %errorlevel% == 0 (
        echo ✓ Secret 'google-cloud-key' created successfully
    ) else (
        echo ✗ Failed to create secret 'google-cloud-key'
        echo.
        echo Please try manually:
        echo   kubectl create secret generic google-cloud-key --from-file=key.json=packages/backend/keys/service-account.json --namespace=lingua-app
        pause
        exit /b 1
    )
)

echo.
echo Building Docker images...
echo.
echo Building backend image...
docker build -t lingua-backend:latest -f docker/backend.Dockerfile .
if %errorlevel% == 0 (
    echo ✓ Backend image built successfully
) else (
    echo ✗ Failed to build backend image
    echo.
    echo Please try manually:
    echo   docker build -t lingua-backend:latest -f docker/backend.Dockerfile .
    pause
    exit /b 1
)

echo.
echo Building frontend image...
docker build -t lingua-frontend:latest -f docker/frontend.Dockerfile .
if %errorlevel% == 0 (
    echo ✓ Frontend image built successfully
) else (
    echo ✗ Failed to build frontend image
    echo.
    echo Please try manually:
    echo   docker build -t lingua-frontend:latest -f docker/frontend.Dockerfile .
    pause
    exit /b 1
)

echo.
echo Deploying application to GKE...
kubectl apply -k k8s/
if %errorlevel% == 0 (
    echo ✓ Application deployed successfully
) else (
    echo ✗ Failed to deploy application
    echo.
    echo Please try manually:
    echo   kubectl apply -k k8s/
    pause
    exit /b 1
)

echo.
echo Verifying deployment...
echo.
echo Pods in 'lingua-app' namespace:
kubectl get pods -n lingua-app
echo.
echo Services in 'lingua-app' namespace:
kubectl get services -n lingua-app

echo.
echo Deployment process completed!
echo.
echo To access your application:
echo 1. Find the external IP of the frontend service above
echo 2. Open a web browser and navigate to http://^<EXTERNAL-IP^>
echo.
pause