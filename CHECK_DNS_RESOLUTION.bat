@echo off
echo ========================================
echo DNS Resolution Check for Lingua Phone
echo ========================================

echo.
echo Checking DNS resolution for lingua-phone.gketurns10.com...
echo.

nslookup lingua-phone.gketurns10.com

if %ERRORLEVEL% EQU 0 (
    echo.
    echo DNS resolution successful!
    echo.
    echo Next steps:
    echo 1. The certificate should now be able to provision
    echo 2. Check certificate status with:
    echo    kubectl get managedcertificate lingua-frontend-certificate -n lingua-app
    echo 3. Check ingress status with:
    echo    kubectl describe ingress lingua-ingress -n lingua-app
    echo.
    echo The certificate should transition from "Provisioning" to "Active" within 5-15 minutes.
) else (
    echo.
    echo DNS resolution failed.
    echo.
    echo This is expected if:
    echo 1. You haven't registered the domain yet
    echo 2. DNS hasn't propagated yet
    echo.
    echo Please ensure:
    echo 1. Domain gketurns10.com is registered
    echo 2. A record for lingua-phone.gketurns10.com points to 34.45.239.154
    echo 3. Wait for DNS propagation (5 minutes to several hours)
)