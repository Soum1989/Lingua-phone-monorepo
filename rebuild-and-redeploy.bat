@echo off
echo ========================================
echo Rebuilding and Redeploying to GKE Cluster
echo ========================================

echo.
echo This script will:
echo 1. Build and push updated Docker images
echo 2. Delete existing pods to force recreation with new images
echo 3. Check the status of the pods
echo.

echo Running Python rebuild and redeployment script...
python rebuild-and-redeploy.py

echo.
echo ========================================
echo Rebuild and redeployment process completed
echo ========================================
echo.
echo To check the status of your pods, run:
echo   kubectl get pods -n lingua-app
echo.
echo If the frontend pod is still crashing, check the logs:
echo   kubectl logs ^<frontend-pod-name^> -n lingua-app
echo.
pause