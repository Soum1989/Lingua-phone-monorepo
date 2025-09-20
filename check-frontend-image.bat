@echo off
color 0A
title Lingua Phone - Frontend Image Check

echo ========================================
echo     LINGUA PHONE FRONTEND IMAGE CHECK
echo ========================================
echo.

echo 1. Checking if frontend Docker image exists locally...
echo ===============================================
docker images gcr.io/lingua-phone/lingua-frontend
echo.

echo 2. Checking Google Container Registry...
echo ===============================
echo This will check if the image exists in GCR
echo (You should see your image in the list if it was pushed successfully)
echo.
gcloud container images list --repository=gcr.io/lingua-phone
echo.

echo 3. Checking image details...
echo ==================
gcloud container images describe gcr.io/lingua-phone/lingua-frontend:latest
echo.

echo ========================================
echo           IMAGE CHECK COMPLETE
echo ========================================
echo.
echo If the image doesn't exist in GCR, you'll need to rebuild and push it.
echo To rebuild and push:
echo 1. Run "rebuild-and-push-frontend.bat"
echo 2. Wait for completion
echo 3. Run this script again to verify
echo.
pause