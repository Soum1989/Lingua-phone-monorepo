@echo off
echo Opening Deployment Instructions...
echo.
echo Please follow the instructions in HOW_TO_DEPLOY.txt to deploy the application.
echo.
echo A new Command Prompt window will open with the deployment script.
echo.
timeout /t 3 >nul

:: Open the instructions
start notepad HOW_TO_DEPLOY.txt

:: Open a new command prompt with the deployment script
start cmd /k "cd /d C:\Users\Lenovo\Lingua-phone-monorepo && complete-deployment-steps.bat"