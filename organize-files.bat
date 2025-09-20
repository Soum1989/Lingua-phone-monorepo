@echo off
setlocal

echo Organizing project files...

REM Create directories if they don't exist
if not exist "scripts" mkdir scripts
if not exist "documentation" mkdir documentation

REM Move script files to scripts directory
move check-prerequisites.bat scripts\ >nul 2>&1
move check-prerequisites.sh scripts\ >nul 2>&1
move deploy-gke.bat scripts\ >nul 2>&1
move deploy-gke.sh scripts\ >nul 2>&1
move check-gcloud-auth.bat scripts\ >nul 2>&1
move check-gcloud-auth.sh scripts\ >nul 2>&1

echo Files organized successfully!

pause