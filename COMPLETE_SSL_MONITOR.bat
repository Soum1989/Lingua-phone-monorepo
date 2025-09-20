@echo off
echo ========================================
echo Complete SSL Setup Monitoring
echo ========================================

echo.
echo 1. Checking ingress status...
kubectl get ingress lingua-ingress -n lingua-app

echo.
echo 2. Checking certificate status...
kubectl get managedcertificate lingua-frontend-certificate -n lingua-app

echo.
echo 3. Detailed certificate information...
kubectl describe managedcertificate lingua-frontend-certificate -n lingua-app | findstr "Status:\|Certificate Status:\|Domain Status:"

echo.
echo 4. Checking ingress events for errors...
kubectl describe ingress lingua-ingress -n lingua-app | findstr "Warning:\|Error:\|Normal"

echo.
echo To verify DNS configuration, run:
echo nslookup lingua-phone.gketurns10.com
echo.
echo Certificate Status Legend:
echo ------------------------
echo Provisioning - Certificate is being created (waiting for DNS verification)
echo Active       - Certificate is ready and valid
echo Failed       - There was an error provisioning the certificate
echo Renewing     - Certificate is being renewed
echo.
echo If the certificate remains in "Provisioning" status:
echo 1. Ensure DNS A record points lingua-phone.gketurns10.com to 34.54.169.200
echo 2. Wait for DNS propagation (can take up to 24 hours, usually much faster)
echo 3. Check with: nslookup lingua-phone.gketurns10.com