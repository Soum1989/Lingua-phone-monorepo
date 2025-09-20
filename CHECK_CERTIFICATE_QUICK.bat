@echo off
echo ========================================
echo Quick SSL Certificate Status Check
echo ========================================

echo.
echo Checking certificate status...
kubectl get managedcertificate lingua-frontend-certificate -n lingua-app

echo.
echo Detailed certificate information...
kubectl describe managedcertificate lingua-frontend-certificate -n lingua-app | findstr "Status:\|Certificate Status:\|Domain Status:"

echo.
echo If the certificate remains in "Provisioning" status with "FailedNotVisible":
echo 1. DNS propagation may still be in progress
echo 2. Try accessing your domain from different locations
echo 3. Wait 10-15 minutes and check again
echo 4. Certificate provisioning can take up to 30 minutes in some cases