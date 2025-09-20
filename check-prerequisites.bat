@echo off
setlocal

echo Checking prerequisites for GKE deployment...

REM Check if gcloud is installed
where gcloud >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ gcloud is not installed. Please install Google Cloud SDK.
    exit /b 1
) else (
    echo ✅ gcloud is installed
    gcloud version | findstr "Google Cloud SDK"
)

REM Check if kubectl is installed
where kubectl >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ kubectl is not installed. Please install kubectl.
    exit /b 1
) else (
    echo ✅ kubectl is installed
    for /f "tokens=*" %%i in ('kubectl version --client') do set KUBECTL_VERSION=%%i
    echo %KUBECTL_VERSION%
)

REM Check if docker is installed
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ docker is not installed. Please install Docker.
    exit /b 1
) else (
    echo ✅ docker is installed
    for /f "tokens=*" %%i in ('docker --version') do set DOCKER_VERSION=%%i
    echo %DOCKER_VERSION%
)

REM Check if gcloud is authenticated
gcloud auth list --filter=status:ACTIVE --format="value(account)" | findstr "." >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  gcloud is not authenticated. Please run 'gcloud auth login'
) else (
    echo ✅ gcloud is authenticated
)

REM Check if gcloud project is set
for /f "tokens=*" %%i in ('gcloud config list project --format="value(core.project)" 2^>nul') do set PROJECT_ID=%%i
if "%PROJECT_ID%"=="" (
    echo ⚠️  gcloud project is not set. Please run 'gcloud config set project YOUR_PROJECT_ID'
) else (
    echo ✅ gcloud project is set to: %PROJECT_ID%
)

echo Prerequisites check completed.
pause