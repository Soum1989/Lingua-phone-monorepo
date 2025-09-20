@echo off
color 0C
title Lingua Phone - Frontend Crash Diagnosis

echo ========================================
echo Lingua Phone - Frontend Crash Diagnosis
echo ========================================
echo.

echo 1. Getting cluster credentials...
echo ================================
gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a

echo.
echo 2. Checking current pod status...
echo =============================
kubectl get pods -n lingua-app

echo.
echo 3. Getting detailed pod information...
echo =================================
kubectl describe pod -l app=lingua-frontend -n lingua-app

echo.
echo 4. Checking pod logs (current)...
echo ==============================
kubectl logs -l app=lingua-frontend -n lingua-app --tail=50

echo.
echo 5. Checking pod logs (previous)...
echo ================================
kubectl logs -l app=lingua-frontend -n lingua-app --previous --tail=50

echo.
echo 6. Checking Kubernetes events...
echo =============================
kubectl get events -n lingua-app --sort-by=.lastTimestamp

echo.
echo 7. Checking service configuration...
echo ================================
kubectl get service lingua-frontend-service -n lingua-app -o wide

echo.
echo 8. Checking backend service (for comparison)...
echo ============================================
kubectl get service lingua-backend-service -n lingua-app -o wide

echo.
echo 9. Checking if the frontend image exists in GCR...
echo ==============================================
docker pull gcr.io/lingua-phone/lingua-frontend:latest

echo.
echo ========================================
echo Diagnosis Complete
echo ========================================
echo.
echo Please review the output above to identify the cause of the frontend crash.
echo.
echo Common causes:
echo 1. Nginx configuration errors
echo 2. Missing files in the Docker image
echo 3. Port binding issues
echo 4. Resource constraints
echo 5. Image not found or corrupted
echo.
pause