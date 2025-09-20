@echo off
echo ========================================
echo DNS Resolution Check
echo ========================================

:loop
echo.
echo Current time: %date% %time%
echo.
echo Checking DNS resolution for lingua-phone.gketurns10.com...
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
    echo DNS resolution failed. This is expected if you haven't configured the DNS record yet.
    echo.
    echo To fix this issue:
    echo 1. Log in to your DNS provider's control panel (where you registered gketurns10.com)
    echo 2. Create an A record with:
    echo    - Name: lingua-phone
    echo    - Type: A
    echo    - Value: 34.160.44.134
    echo 3. Save the changes
    echo.
    echo DNS propagation can take anywhere from a few minutes to several hours.
    echo.
    echo Press Ctrl+C to stop monitoring, or wait 60 seconds for automatic refresh...
    timeout /t 60 /nobreak >nul
    goto loop
)