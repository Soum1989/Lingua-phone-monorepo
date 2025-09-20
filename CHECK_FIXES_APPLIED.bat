@echo off
color 0A
title Lingua Phone - Check Fixes Applied

echo ========================================
echo Lingua Phone - Check Fixes Applied
echo ========================================
echo.

echo This script will check if all the fixes have been applied to the Lingua Phone project.
echo.

echo 1. Checking for diagnostic scripts...
echo =====================
if exist "application-status.bat" (
    echo [OK] application-status.bat found
) else (
    echo [MISSING] application-status.bat not found
)

if exist "check-frontend-deployment.bat" (
    echo [OK] check-frontend-deployment.bat found
) else (
    echo [MISSING] check-frontend-deployment.bat not found
)

if exist "check-backend-service.bat" (
    echo [OK] check-backend-service.bat found
) else (
    echo [MISSING] check-backend-service.bat not found
)

if exist "comprehensive-status-check.bat" (
    echo [OK] comprehensive-status-check.bat found
) else (
    echo [MISSING] comprehensive-status-check.bat not found
)

if exist "fix-frontend-deployment.bat" (
    echo [OK] fix-frontend-deployment.bat found
) else (
    echo [MISSING] fix-frontend-deployment.bat not found
)

if exist "final-verification.bat" (
    echo [OK] final-verification.bat found
) else (
    echo [MISSING] final-verification.bat not found
)

if exist "open-application.bat" (
    echo [OK] open-application.bat found
) else (
    echo [MISSING] open-application.bat not found
)
echo.

echo 2. Checking for documentation files...
echo =====================
if exist "FINAL_SUMMARY.md" (
    echo [OK] FINAL_SUMMARY.md found
) else (
    echo [MISSING] FINAL_SUMMARY.md not found
)

if exist "DEPLOYMENT_STATUS.md" (
    echo [OK] DEPLOYMENT_STATUS.md found
) else (
    echo [MISSING] DEPLOYMENT_STATUS.md not found
)

if exist "README.txt" (
    echo [OK] README.txt found
) else (
    echo [MISSING] README.txt not found
)

if exist "COMPLETION_MESSAGE.txt" (
    echo [OK] COMPLETION_MESSAGE.txt found
) else (
    echo [MISSING] COMPLETION_MESSAGE.txt not found
)
echo.

echo 3. Checking for support scripts...
echo =====================
if exist "PROJECT_SUMMARY.bat" (
    echo [OK] PROJECT_SUMMARY.bat found
) else (
    echo [MISSING] PROJECT_SUMMARY.bat not found
)

if exist "SUCCESS_MESSAGE.bat" (
    echo [OK] SUCCESS_MESSAGE.bat found
) else (
    echo [MISSING] SUCCESS_MESSAGE.bat not found
)

if exist "CHECK_FIXES_APPLIED.bat" (
    echo [OK] CHECK_FIXES_APPLIED.bat found (this script)
) else (
    echo [ERROR] CHECK_FIXES_APPLIED.bat not found
)
echo.

echo ========================================
echo Check complete!
echo ========================================
echo.
echo All required files should be present in the directory.
echo If any files are missing, please let me know.
echo.
echo To continue troubleshooting:
echo 1. Run comprehensive-status-check.bat to check the current status
echo 2. Run fix-frontend-deployment.bat to attempt to fix the frontend deployment
echo 3. Check the results and logs to identify the root cause
echo.
pause