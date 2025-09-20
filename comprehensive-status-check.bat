@echo off
color 0A
title Lingua Phone - Comprehensive Status Check

echo ========================================
echo Lingua Phone - Comprehensive Status Check
echo ========================================
echo.

echo 1. Cluster Information
echo ==================
kubectl cluster-info
echo.

echo 2. Namespaces
echo ==========
kubectl get namespaces
echo.

echo 3. All Pods in lingua-app namespace
echo =============================
kubectl get pods -n lingua-app
echo.

echo 4. All Services in lingua-app namespace
echo =============================
kubectl get services -n lingua-app
echo.

echo 5. All Deployments in lingua-app namespace
echo =============================
kubectl get deployments -n lingua-app
echo.

echo 6. Frontend Pod Details
echo ==================
kubectl get pods -l app=lingua-frontend -n lingua-app -o wide
echo.

echo 7. Backend Pod Details
echo =================
kubectl get pods -l app=lingua-backend -n lingua-app -o wide
echo.

echo 8. Frontend Service Details
echo =====================
kubectl get service lingua-frontend-service -n lingua-app -o wide
echo.

echo 9. Backend Service Details
echo ====================
kubectl get service lingua-backend-service -n lingua-app -o wide
echo.

echo 10. Recent Events in lingua-app namespace
echo =============================
kubectl get events -n lingua-app --sort-by=.metadata.creationTimestamp
echo.

echo 11. Frontend Pod Logs (last 20 lines)
echo =============================
kubectl logs -l app=lingua-frontend -n lingua-app --tail=20
echo.

echo 12. Backend Pod Logs (last 20 lines)
echo ====================
kubectl logs -l app=lingua-backend -n lingua-app --tail=20
echo.

echo ========================================
echo Comprehensive Status Check Complete!
echo ========================================
pause