@echo off
color 0A
title Lingua Phone - Recreate Frontend Pods

echo ========================================
echo Lingua Phone - Recreate Frontend Pods
echo ========================================
echo.

echo Deleting all frontend pods to force recreation...
echo =============================
kubectl delete pods -l app=lingua-frontend -n lingua-app
echo.

echo Waiting 30 seconds for pods to be recreated...
echo =============================
timeout /t 30 /nobreak
echo.

echo Checking new pod status...
echo ==================
kubectl get pods -n lingua-app -l app=lingua-frontend
echo.

pause