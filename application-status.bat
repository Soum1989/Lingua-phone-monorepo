@echo off
color 0A
title Lingua Phone - Application Status

echo ========================================
echo Lingua Phone - Application Status
echo ========================================
echo.

echo 1. Getting cluster info...
echo ==================
kubectl cluster-info
echo.

echo 2. Getting pods in lingua-app namespace...
echo =============================
kubectl get pods -n lingua-app
echo.

echo 3. Getting services in lingua-app namespace...
echo =============================
kubectl get services -n lingua-app
echo.

echo 4. Getting deployments in lingua-app namespace...
echo =============================
kubectl get deployments -n lingua-app
echo.

echo 5. Getting events in lingua-app namespace...
echo =============================
kubectl get events -n lingua-app
echo.

echo ========================================
echo Status check complete!
echo ========================================
pause