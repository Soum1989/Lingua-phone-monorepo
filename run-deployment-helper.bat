@echo off
title Lingua Phone - Deployment Helper
echo ========================================
echo Lingua Phone - Deployment Helper
echo ========================================
echo.
echo This script will help you check your deployment status
echo or deploy your application using Miniconda.
echo.

REM Activate Miniconda environment
echo Activating Miniconda environment...
call conda activate base
if %errorlevel% neq 0 (
    echo Failed to activate Miniconda environment.
    echo Please make sure Miniconda is properly installed.
    pause
    exit /b 1
)

REM Check if Python is available
echo Checking Python availability...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not available from Miniconda.
    echo Please make sure Miniconda is properly installed.
    pause
    exit /b 1
)

echo Running deployment helper script...
python deployment_helper.py

echo.
echo ========================================
echo Deployment helper completed!
echo ========================================
echo.
pause