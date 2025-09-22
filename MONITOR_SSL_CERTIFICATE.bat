@echo off
title SSL Certificate Monitor - Lingua Phone

echo ========================================
echo SSL Certificate Monitor for Lingua Phone
echo ========================================
echo.
echo This script will monitor the SSL certificate status for:
echo https://lingua-phone.gketurns10.com
echo.
echo Current Load Balancer IP: 34.54.239.230
echo Current Service IP: 34.45.239.154
echo.
echo IMPORTANT: Make sure your DNS A record points to the Load Balancer IP!
echo.
echo Press Ctrl+C to stop monitoring
echo.
echo ========================================
echo Starting monitoring...
echo.

:loop
echo [%date% %time%] Checking certificate status...
echo --------------------------------------------------

REM Check if kubectl is available
where kubectl >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: kubectl not found. Please install kubectl and try again.
    pause
    exit /b 1
)

REM Get certificate status
for /f "tokens=*" %%i in ('kubectl get managedcertificate lingua-frontend-certificate -n lingua-app -o jsonpath^="{.status.certificateStatus}" 2^>nul') do set CERT_STATUS=%%i

REM Get domain status
for /f "tokens=*" %%i in ('kubectl get managedcertificate lingua-frontend-certificate -n lingua-app -o jsonpath^="{.status.domainStatus[0].status}" 2^>nul') do set DOMAIN_STATUS=%%i

REM Display current status
echo Certificate Status: %CERT_STATUS%
echo Domain Status: %DOMAIN_STATUS%

REM Check if certificate is active
if /i "%CERT_STATUS%"=="Active" (
    if /i "%DOMAIN_STATUS%"=="True" (
        echo.
        echo **************************************************
        echo *  ✅ SSL CERTIFICATE IS NOW ACTIVE!              *
        echo *                                                *
        echo *  Your application should be accessible at:     *
        echo *  https://lingua-phone.gketurns10.com           *
        echo *                                                *
        echo *  Microphone and STT functionality should work  *
        echo **************************************************
        echo.
        pause
        exit /b 0
    )
)

echo.
echo ⏳ Waiting for certificate activation... Checking again in 60 seconds.
echo.
timeout /t 60 /nobreak >nul
goto loop