@echo off
color 0A
title Lingua Phone - Complete Status Check

echo ========================================
echo Lingua Phone - Complete Status Check
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
echo 3. Checking service status...
echo =========================
kubectl get services -n lingua-app

echo.
echo 4. Checking backend service details...
echo ================================
kubectl get service lingua-backend-service -n lingua-app -o wide

echo.
echo 5. Checking frontend service details...
echo ================================
kubectl get service lingua-frontend-service -n lingua-app -o wide

echo.
echo ========================================
echo Complete Status Check Finished
echo ========================================
echo.
echo Summary of what we've fixed:
echo =============================
echo 1. Shopping Assistant Recommendation System - FIXED
echo 2. Translation Issues - FIXED
echo 3. Docker Container Issues - FIXED
echo 4. Google Cloud TTS Setup - FIXED
echo 5. GKE Deployment - IN PROGRESS (Frontend CrashLoopBackOff)
echo.
echo Recent fixes applied:
echo ====================
echo 1. Updated frontend deployment to use ConfigMap for nginx config
echo 2. Fixed nginx upstream server configuration
echo 3. Applied updated deployment to cluster
echo 4. Deleted old pod to force recreation with new config
echo.
echo Next steps:
echo ===========
echo 1. Wait a few minutes for the new pod to initialize
echo 2. Run this script again to check if the pod is now running
echo 3. If still crashing, run: diagnose-frontend-crash.bat
echo.
echo Access your application at: http://34.45.239.154
echo.
echo For detailed information, check these files:
echo - STATUS_SUMMARY.md
echo - FINAL_IMPLEMENTATION_SUMMARY.md
echo - NEXT_STEPS.md
echo.
pause