@echo off
color 0A
title Lingua Phone - Frontend Issue Diagnosis

echo ========================================
echo     LINGUA PHONE FRONTEND DIAGNOSIS
echo ========================================
echo.

echo 1. Getting pod details...
echo ==================
kubectl get pods -n lingua-app -o wide
echo.

echo 2. Checking frontend pod logs...
echo ========================
echo -- Latest logs from CrashLoopBackOff pod --
kubectl logs -n lingua-app -l app=lingua-frontend --tail=50
echo.

echo -- Previous container logs --
kubectl logs -n lingua-app -l app=lingua-frontend --previous
echo.

echo 3. Describing frontend pods...
echo ======================
kubectl describe pod -n lingua-app -l app=lingua-frontend
echo.

echo 4. Checking frontend deployment...
echo =========================
kubectl describe deployment -n lingua-app lingua-frontend
echo.

echo 5. Checking ConfigMap...
echo ================
kubectl get configmap -n lingua-app
echo.

echo ========================================
echo           DIAGNOSIS COMPLETE
echo ========================================
echo.
echo Check the output above for error messages that indicate what is causing the frontend to crash.
echo Common issues:
echo - Missing environment variables
echo - Incorrect image name or tag
echo - Configuration errors
echo - Port binding issues
echo - File permission problems
echo.
pause