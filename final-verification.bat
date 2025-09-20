@echo off
color 0A
title Lingua Phone - Final Verification

echo ========================================
echo Lingua Phone - Final Verification
echo ========================================
echo.

echo 1. Checking cluster info...
echo =====================
kubectl cluster-info
echo.

echo 2. Checking namespaces...
echo ===================
kubectl get namespaces
echo.

echo 3. Checking pods in lingua-app namespace...
echo =====================================
kubectl get pods -n lingua-app
echo.

echo 4. Checking services in lingua-app namespace...
echo =========================================
kubectl get services -n lingua-app
echo.

echo 5. Checking frontend pod logs...
echo ===========================
kubectl logs -l app=lingua-frontend -n lingua-app --tail=30
echo.

echo 6. Checking backend pod logs...
echo ===========================
kubectl logs -l app=lingua-backend -n lingua-app --tail=30
echo.

echo 7. Checking if application is accessible...
echo ======================================
curl -v http://34.45.239.154
echo.

echo ========================================
echo Final verification complete!
echo ========================================
echo.
echo If the frontend pod is now showing "1/1 Running" and there are no errors in the logs,
echo your application should be accessible at http://34.45.239.154
echo.
pause