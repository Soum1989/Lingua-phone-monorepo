@echo off
echo Verifying Docker images in Google Container Registry...
echo.
echo Checking if we're authenticated with Google Cloud...
gcloud auth list
echo.
echo Listing images in Google Container Registry for project lingua-phone...
gcloud container images list --repository=gcr.io/lingua-phone
echo.
echo If no images are listed above, we need to build and push them.
echo Run 'build-and-push-images.bat' to build and push the images.