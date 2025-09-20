@echo off
setlocal

REM Variables
set PROJECT_ID=lingua-phone
set CLUSTER_NAME=lingua-cluster
set ZONE=us-central1-a

echo Creating GKE cluster...
echo This may take several minutes...

gcloud container clusters create %CLUSTER_NAME% --zone=%ZONE% --num-nodes=3 --machine-type=e2-medium --enable-autoscaling --min-nodes=1 --max-nodes=5 --enable-autorepair --enable-autoupgrade

if %errorlevel% equ 0 (
    echo Cluster created successfully!
    
    REM Get credentials for the cluster
    echo Getting cluster credentials...
    gcloud container clusters get-credentials %CLUSTER_NAME% --zone=%ZONE%
    
    if %errorlevel% equ 0 (
        echo Cluster credentials configured successfully!
        echo You can now deploy your application to GKE.
    ) else (
        echo Failed to get cluster credentials.
        exit /b 1
    )
) else (
    echo Failed to create cluster.
    exit /b 1
)

pause