@echo off
echo Deploying Lingua Phone application to GKE...

echo.
echo 1. Checking if namespace lingua-app exists...
kubectl get namespace lingua-app >nul 2>&1
if %errorlevel% == 0 (
    echo    Namespace lingua-app already exists.
) else (
    echo    Creating namespace lingua-app...
    kubectl create namespace lingua-app
    if %errorlevel% == 0 (
        echo    Namespace lingua-app created successfully.
    ) else (
        echo    Failed to create namespace lingua-app.
        exit /b 1
    )
)

echo.
echo 2. Creating secret for Google Cloud credentials...
kubectl create secret generic google-cloud-key --from-file=key.json=packages/backend/keys/service-account.json --namespace=lingua-app
if %errorlevel% == 0 (
    echo    Secret google-cloud-key created successfully.
) else (
    echo    Failed to create secret google-cloud-key.
    exit /b 1
)

echo.
echo 3. Building Docker images...
echo    Building backend image...
docker build -t lingua-backend:latest -f docker/backend.Dockerfile .
if %errorlevel% == 0 (
    echo    Backend image built successfully.
) else (
    echo    Failed to build backend image.
    exit /b 1
)

echo    Building frontend image...
docker build -t lingua-frontend:latest -f docker/frontend.Dockerfile .
if %errorlevel% == 0 (
    echo    Frontend image built successfully.
) else (
    echo    Failed to build frontend image.
    exit /b 1
)

echo.
echo 4. Deploying application to GKE...
kubectl apply -k k8s/
if %errorlevel% == 0 (
    echo    Application deployed successfully.
) else (
    echo    Failed to deploy application.
    exit /b 1
)

echo.
echo Deployment completed successfully!
echo You can check the status of your deployment with:
echo    kubectl get pods -n lingua-app