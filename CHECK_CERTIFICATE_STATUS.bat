@echo off
echo ========================================
echo SSL Certificate Status Check
echo ========================================

:loop
echo.
echo Current time: %date% %time%
echo.
echo 1. Checking certificate status...
kubectl get managedcertificate lingua-frontend-certificate -n lingua-app

echo.
echo 2. Detailed certificate information...
kubectl describe managedcertificate lingua-frontend-certificate -n lingua-app | findstr "Status:\|Certificate Status:\|Domain Status:"

echo.
echo 3. Checking ingress status...
kubectl get ingress lingua-ingress -n lingua-app

echo.
echo Certificate Status Legend:
echo ------------------------
echo Provisioning - Certificate is being created (this is normal during setup)
echo Active       - Certificate is ready and valid
echo Failed       - There was an error provisioning the certificate
echo Renewing     - Certificate is being renewed

echo.
echo If status is "Provisioning" for more than 15-20 minutes after DNS is configured,
echo there may be an issue with your domain configuration.

echo.
echo Press Ctrl+C to stop monitoring, or wait 60 seconds for automatic refresh...
timeout /t 60 /nobreak >nul
goto loop