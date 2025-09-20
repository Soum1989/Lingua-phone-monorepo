@echo off
REM This script updates all GKE configuration files with your actual project ID
REM Usage: UPDATE_GKE_CONFIG.bat YOUR_PROJECT_ID

if "%1"=="" (
    echo Usage: %0 YOUR_PROJECT_ID
    echo Please provide your Google Cloud Project ID as an argument
    exit /b 1
)

set PROJECT_ID=%1
echo Updating configuration files with project ID: %PROJECT_ID%

REM Update deployment files
echo Updating backend deployment...
powershell -Command "(gc k8s\backend-deployment.yaml) -replace 'your-project-id', '%PROJECT_ID%' | Out-File -encoding ASCII k8s\backend-deployment.yaml"

echo Updating frontend deployment...
powershell -Command "(gc k8s\frontend-deployment.yaml) -replace 'your-project-id', '%PROJECT_ID%' | Out-File -encoding ASCII k8s\frontend-deployment.yaml"

echo Updating deploy-gke.bat...
powershell -Command "(gc deploy-gke.bat) -replace 'your-gcp-project-id', '%PROJECT_ID%' | Out-File -encoding ASCII deploy-gke.bat"

echo Updating deploy-gke.sh...
powershell -Command "(gc deploy-gke.sh) -replace 'your-gcp-project-id', '%PROJECT_ID%' | Out-File -encoding ASCII deploy-gke.sh"

echo Configuration files updated successfully!

echo Next steps:
echo 1. Create your Google Cloud service account and key
echo 2. Create the Kubernetes secret
echo 3. Run the deployment script