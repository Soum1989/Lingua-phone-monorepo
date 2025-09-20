@echo off
color 0A
title Lingua Phone - Get Pod Details

echo ========================================
echo Lingua Phone - Get Pod Details
echo ========================================
echo.

echo 1. Getting pod details...
echo ===================
kubectl describe pod -l app=lingua-frontend -n lingua-app
echo.

echo 2. Getting pod logs...
echo =================
kubectl logs -l app=lingua-frontend -n lingua-app --tail=50
echo.

echo 3. Getting previous pod logs (if any)...
echo ===============================
kubectl logs -l app=lingua-frontend -n lingua-app --previous
echo.

echo ========================================
echo Pod details retrieval complete!
echo ========================================
pause