@echo off
setlocal enabledelayedexpansion
color 0A
title Lingua Phone - Check Frontend Status

echo ========================================
echo Lingua Phone - Check Frontend Status
echo ========================================
echo.

echo Getting all pods in lingua-app namespace...
echo =============================
kubectl get pods -n lingua-app
echo.

echo Getting frontend pod names...
echo ==================
for /f "tokens=*" %%i in ('kubectl get pods -n lingua-app -l app=lingua-frontend -o name') do (
    set POD_NAME=%%i
    echo =============================
    echo Checking pod: !POD_NAME!
    echo =============================
    kubectl describe pod !POD_NAME! -n lingua-app
    echo.
    echo Logs for pod !POD_NAME!:
    kubectl logs !POD_NAME! -n lingua-app --previous
    echo.
)
echo.

echo Checking frontend service...
echo ==================
kubectl get service lingua-frontend-service -n lingua-app -o wide
echo.

pause