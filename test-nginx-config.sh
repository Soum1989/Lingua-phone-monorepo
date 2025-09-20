#!/bin/bash
# Simple script to test nginx configuration in the frontend Docker image

echo "Testing nginx configuration in frontend Docker image..."

# Create a temporary container from the frontend image
docker create --name test-nginx gcr.io/lingua-phone/lingua-frontend:latest

# Copy the nginx.conf from the container
docker cp test-nginx:/etc/nginx/nginx.conf ./temp-nginx.conf

# Display the nginx.conf
echo "=== NGINX CONFIGURATION ==="
cat ./temp-nginx.conf

# Clean up
docker rm test-nginx
rm ./temp-nginx.conf

echo "=== END NGINX CONFIGURATION ==="