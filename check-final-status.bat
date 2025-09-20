@echo off
color 0A
title Lingua Phone - Final Status Check

echo ========================================
echo Lingua Phone - Final Status Check
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
echo ========================================
echo Status check complete!
echo ========================================
echo.
echo Please review the status information above.
echo.
echo For detailed information, please check:
echo - STATUS_SUMMARY.md
echo.
echo Your application should be accessible at:
echo - http://34.45.239.154
echo.
echo If the frontend pod is still showing CrashLoopBackOff:
echo 1. Run: diagnose-frontend-crash.bat
echo 2. Check the generated log files
echo 3. Review the nginx configuration in docker/nginx-k8s.conf
echo.
pause