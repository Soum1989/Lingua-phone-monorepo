@echo off
echo ========================================
echo Waiting for Ingress IP Address
echo ========================================

:loop
echo.
echo Checking ingress status...
kubectl get ingress lingua-ingress -n lingua-app
for /f "tokens=4" %%a in ('kubectl get ingress lingua-ingress -n lingua-app ^| findstr "lingua-phone.gketurns10.com"') do set IP=%%a
if "%IP%"=="" (
    echo No IP address assigned yet. Waiting 30 seconds...
    timeout /t 30 /nobreak >nul
    goto loop
) else (
    echo.
    echo Ingress IP address assigned: %IP%
    echo.
    echo Next steps:
    echo 1. Create an A record in your DNS provider pointing lingua-phone.gketurns10.com to %IP%
    echo 2. Wait for DNS propagation (this can take a few minutes to several hours)
    echo 3. Check certificate status with: kubectl describe managedcertificate lingua-frontend-certificate -n lingua-app
    echo.
    echo The certificate provisioning process can take 10-15 minutes after DNS is properly configured.
)