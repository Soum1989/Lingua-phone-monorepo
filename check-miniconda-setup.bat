@echo off
echo ==========================================
echo Checking Miniconda and Python Setup
echo ==========================================

echo 1. Checking if conda is available...
conda --version
if %errorlevel% neq 0 (
    echo ERROR: Conda is not available in PATH
    echo Please make sure Miniconda is properly installed and added to PATH
    goto end
)

echo 2. Activating base environment...
call conda activate base
if %errorlevel% neq 0 (
    echo ERROR: Failed to activate base environment
    goto end
)

echo 3. Checking Python version...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python is not available
    goto end
)

echo 4. Checking if required modules are available...
python -c "import json, os, sys; print('Core modules are available')"

echo.
echo ==========================================
echo Miniconda and Python are properly set up!
echo You can now run the deployment script:
echo   complete-deployment-miniconda.bat
echo ==========================================

:end
pause