@echo off
color 0A
title Lingua Phone - Simple Check

echo ========================================
echo Lingua Phone - Simple Check
echo ========================================
echo.

echo Checking pod status...
echo =================
kubectl get pods -n lingua-app
echo.

echo Checking service status...
echo ===================
kubectl get services -n lingua-app
echo.

pause