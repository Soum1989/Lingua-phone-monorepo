@echo off
echo ========================================
echo Fixing and Redeploying to GKE Cluster
echo ========================================

echo.
echo This script will:
echo 1. Build and push updated Docker images
echo 2. Apply Kubernetes manifests with fixes
echo 3. Check the status of the pods
echo.

echo Running Python redeployment script...
python fix-and-redeploy.py

echo.
echo ========================================
echo Redeployment process completed
echo ========================================
echo.
echo To check the status of your pods, run:
echo   kubectl get pods -n lingua-app
echo.
echo To check the external IP of your frontend service, run:
echo   kubectl get services -n lingua-app
echo.
pause