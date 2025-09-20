@echo off
color 0A
title Lingua Phone - Verify Application

cls
echo.
echo =====================================================================
echo                 LINGUA PHONE APPLICATION VERIFICATION
echo =====================================================================
echo.
echo This script will help you verify if your Lingua Phone application is
echo working correctly after deployment.
echo.
echo Press any key to continue...
pause >nul
echo.

echo 1. CHECKING POD STATUS...
echo =======================
kubectl get pods -n lingua-app
echo.

echo 2. CHECKING SERVICE STATUS...
echo ==========================
kubectl get services -n lingua-app
echo.

echo 3. GETTING EXTERNAL IP ADDRESS...
echo ===============================
set EXTERNAL_IP=
for /f "tokens=4" %%a in ('kubectl get services -n lingua-app ^| findstr lingua-frontend-service') do set EXTERNAL_IP=%%a
if "%EXTERNAL_IP%"=="" (
    echo ERROR: Could not retrieve external IP address
    echo Please check your service status above
) else (
    echo External IP Address: %EXTERNAL_IP%
    echo.
    echo 4. TESTING APPLICATION ACCESS...
    echo ============================
    echo Opening http://%EXTERNAL_IP% in your default browser...
    start http://%EXTERNAL_IP%
    echo.
    echo If the application page loads correctly, your deployment was successful!
    echo.
)

echo =====================================================================
echo                          VERIFICATION COMPLETE
echo =====================================================================
echo.
echo To manually check your application:
echo 1. Open a web browser
echo 2. Navigate to http://%EXTERNAL_IP%
echo 3. Test the shopping assistant with queries like:
echo    - "I'm looking for a women's t-shirt"
echo    - "Show me some necklaces"
echo    - "I want men's jeans"
echo.
echo All features should be working correctly:
echo - Shopping assistant recommendations
echo - Multilingual support (try switching languages)
echo - Gender-specific clothing recommendations
echo - Google Cloud TTS (audio playback)
echo - Product rendering from Bazaar Marketplace
echo.
echo If you encounter any issues, please check the documentation files:
echo - DEPLOYMENT_COMPLETE_SUMMARY.md
echo - FINAL_FIXES_SUMMARY.md
echo - COMPREHENSIVE_DEPLOYMENT_SUMMARY.md
echo.
pause