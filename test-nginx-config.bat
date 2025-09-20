@echo off
echo Testing nginx configuration in frontend Docker image...

REM Create a temporary container from the frontend image
docker create --name test-nginx gcr.io/lingua-phone/lingua-frontend:latest

REM Copy the nginx.conf from the container
docker cp test-nginx:/etc/nginx/nginx.conf temp-nginx.conf

REM Display the nginx.conf
echo === NGINX CONFIGURATION ===
type temp-nginx.conf

REM Clean up
docker rm test-nginx
del temp-nginx.conf

echo === END NGINX CONFIGURATION ===