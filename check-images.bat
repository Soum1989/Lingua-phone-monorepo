@echo off
color 0A
title Lingua Phone - Check Images

echo ========================================
echo Lingua Phone - Check Images
echo ========================================
echo.

echo 1. Checking if gcloud is authenticated...
echo ==============================
gcloud auth list
echo.

echo 2. Listing images in Google Container Registry...
echo ======================================
gcloud container images list --repository=gcr.io/lingua-phone
echo.

echo 3. Checking if the frontend image exists...
echo ===============================
gcloud container images list-tags gcr.io/lingua-phone/lingua-frontend
echo.

echo ========================================
echo Image check complete!
echo ========================================
pause