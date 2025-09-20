@echo off
title Lingua Phone - Complete Fix and Deployment
echo ========================================
echo Lingua Phone - Complete Fix and Deployment
echo ========================================
echo.

echo This script will:
echo 1. Verify all fixes are in place
echo 2. Build and push updated Docker images
echo 3. Apply Kubernetes manifests with fixes
echo 4. Check the status of the pods
echo.

echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo 1. Verifying fixes...
echo ===================
python verify-fixes.py
echo.

echo 2. Getting cluster credentials...
echo ================================
gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a
echo.

echo 3. Building and pushing Docker images...
echo =======================================
echo Building backend image...
docker build -t gcr.io/lingua-phone/lingua-backend:latest -f docker/backend.Dockerfile . || goto :error

echo Building frontend image with Kubernetes-specific configuration...
docker build -t gcr.io/lingua-phone/lingua-frontend:latest -f docker/frontend-k8s.Dockerfile . || goto :error

echo Pushing backend image...
docker push gcr.io/lingua-phone/lingua-backend:latest || goto :error

echo Pushing frontend image...
docker push gcr.io/lingua-phone/lingua-frontend:latest || goto :error
echo.

echo 4. Applying Kubernetes manifests...
echo ==================================
kubectl apply -k k8s/ || goto :error
echo.

echo 5. Waiting for deployments to be ready...
echo =======================================
timeout /t 30 /nobreak >nul
echo.

echo 6. Checking pod status...
echo ========================
kubectl get pods -n lingua-app
echo.

echo ========================================
echo Deployment process completed!
echo ========================================
echo.
echo Please check the pod status above. The frontend pod should now be running.
echo If it's still showing CrashLoopBackOff, please check the pod logs:
echo   kubectl logs ^<frontend-pod-name^> -n lingua-app
echo.
echo To get the external IP of your application:
echo   kubectl get services -n lingua-app
echo.
goto :end

:error
echo.
echo ========================================
echo ERROR: Deployment failed!
echo ========================================
echo.
echo Please check the error messages above and try again.
echo You can also check the pod status with:
echo   kubectl get pods -n lingua-app
echo.

:end
echo.
echo Press any key to exit...
pause >nul