@echo off
echo Checking for placeholders in Kubernetes files...
echo.

echo Checking for YOUR_PROJECT_ID:
findstr /s /i "YOUR_PROJECT_ID" k8s\*.yaml
if %errorlevel% equ 0 (
    echo ^>^> YOUR_PROJECT_ID placeholders found
) else (
    echo ^>^> No YOUR_PROJECT_ID placeholders found
)
echo.

echo Checking for gcr.io placeholders:
findstr /s /i "gcr.io" k8s\*.yaml
if %errorlevel% equ 0 (
    echo ^>^> gcr.io placeholders found
) else (
    echo ^>^> No gcr.io placeholders found
)
echo.

echo Check complete.