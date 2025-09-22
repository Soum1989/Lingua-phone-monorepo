@echo off
title SSL Resources Cleanup - Lingua Phone

echo ========================================
echo SSL Resources Cleanup for Lingua Phone
echo ========================================
echo.
echo This script will clean up existing SSL resources to prepare for a fresh deployment.
echo.
echo WARNING: This will delete the current managed certificate and ingress.
echo Make sure you want to proceed!
echo.
pause

echo.
echo 1. Deleting existing managed certificate...
echo ----------------------------------------
kubectl delete managedcertificate lingua-frontend-certificate -n lingua-app
if %errorlevel% equ 0 (
    echo ✅ Managed certificate deleted successfully
) else (
    echo ⚠️  No managed certificate found or deletion failed
)

echo.
echo 2. Deleting existing ingress...
echo -------------------------------
kubectl delete ingress lingua-ingress -n lingua-app
if %errorlevel% equ 0 (
    echo ✅ Ingress deleted successfully
) else (
    echo ⚠️  No ingress found or deletion failed
)

echo.
echo 3. Verifying deletion...
echo ------------------------
echo Checking for remaining SSL resources:
kubectl get managedcertificate -n lingua-app
kubectl get ingress -n lingua-app

echo.
echo 4. Cleanup complete!
echo -------------------
echo.
echo Next steps for this afternoon:
echo 1. Verify DNS A record points to 34.54.239.230
echo 2. Apply new managed certificate: kubectl apply -f k8s/managed-certificate.yaml
echo 3. Wait 30 seconds
echo 4. Apply new ingress: kubectl apply -f k8s/ingress.yaml
echo 5. Monitor with MONITOR_SSL_CERTIFICATE.bat
echo.
echo Refer to AFTERNOON_SSL_DEPLOYMENT_PLAN.md for detailed instructions.
echo.
pause