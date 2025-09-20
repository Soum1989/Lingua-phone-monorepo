@echo off
color 0A
title Lingua Phone - Simple Status Check

echo ========================================
echo Lingua Phone - Simple Status Check
echo ========================================
echo.

echo Checking cluster info...
echo =====================
kubectl cluster-info
echo.

echo Checking namespaces...
echo ===================
kubectl get namespaces
echo.

echo Checking pods in lingua-app namespace...
echo =====================================
kubectl get pods -n lingua-app
echo.

echo Checking services in lingua-app namespace...
echo =========================================
kubectl get services -n lingua-app
echo.

echo If you see CrashLoopBackOff for the frontend pod, please run:
echo   kubectl logs -l app=lingua-frontend -n lingua-app
echo.

pause