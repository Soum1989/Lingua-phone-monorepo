@echo off
color 0A
title Lingua Phone - Pod Status Check

echo ========================================
echo Lingua Phone - Pod Status Check
echo ========================================
echo.

echo Checking pod status in lingua-app namespace...
echo ==============================================
kubectl get pods -n lingua-app

echo.
echo ========================================
echo Check completed!
echo ========================================
echo.
pause