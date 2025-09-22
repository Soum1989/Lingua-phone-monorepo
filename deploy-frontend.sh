#!/bin/bash

# Frontend Deployment Script

PROJECT_ID="lingua-phone"
IMAGE_NAME="lingua-frontend"
TAG="latest"

echo "Building frontend Docker image..."
docker build -t gcr.io/$PROJECT_ID/$IMAGE_NAME:$TAG -f docker/frontend-k8s.Dockerfile .

if [ $? -ne 0 ]; then
    echo "Error: Failed to build Docker image"
    exit 1
fi

echo "Pushing image to Google Container Registry..."
docker push gcr.io/$PROJECT_ID/$IMAGE_NAME:$TAG

if [ $? -ne 0 ]; then
    echo "Error: Failed to push Docker image"
    exit 1
fi

echo "Deploying to GKE..."
kubectl apply -f k8s/frontend-deployment.yaml

if [ $? -ne 0 ]; then
    echo "Error: Failed to deploy to GKE"
    exit 1
fi

echo "Deployment completed successfully!"
echo "Checking pod status..."
kubectl get pods -n lingua-app