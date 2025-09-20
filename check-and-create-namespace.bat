@echo off
echo Checking if namespace lingua-app exists...
kubectl get namespace lingua-app >nul 2>&1
if %errorlevel% == 0 (
    echo Namespace lingua-app already exists.
) else (
    echo Creating namespace lingua-app...
    kubectl create namespace lingua-app
    if %errorlevel% == 0 (
        echo Namespace lingua-app created successfully.
    ) else (
        echo Failed to create namespace lingua-app.
    )
)