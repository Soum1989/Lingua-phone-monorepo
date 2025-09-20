#!/bin/bash

# Exit on any error
set -e

# Variables
PROJECT_ID="lingua-phone"
CLUSTER_NAME="lingua-cluster"
ZONE="us-central1-a"
REGION="us-central1"

echo "Starting deployment to GKE..."

# Authenticate with Google Cloud (if not already done)
# gcloud auth login

# Set the project
# gcloud config set project $PROJECT_ID

# Create GKE cluster (if it doesn't exist)
echo "Creating GKE cluster (if it doesn't exist)..."
gcloud container clusters create $CLUSTER_NAME \
    --zone=$ZONE \
    --num-nodes=3 \
    --machine-type=e2-medium \
    --enable-autoscaling \
    --min-nodes=1 \
    --max-nodes=5 \
    --enable-autorepair \
    --enable-autoupgrade

# Get credentials for the cluster
echo "Getting cluster credentials..."
gcloud container clusters get-credentials $CLUSTER_NAME --zone=$ZONE

# Build Docker images
echo "Building Docker images..."
docker build -t lingua-backend:latest -f docker/backend.Dockerfile .
docker build -t lingua-frontend:latest -f docker/frontend.Dockerfile .

# Tag images for Google Container Registry
echo "Tagging images for GCR..."
docker tag lingua-backend:latest gcr.io/$PROJECT_ID/lingua-backend:latest
docker tag lingua-frontend:latest gcr.io/$PROJECT_ID/lingua-frontend:latest

# Push images to Google Container Registry
echo "Pushing images to GCR..."
docker push gcr.io/$PROJECT_ID/lingua-backend:latest
docker push gcr.io/$PROJECT_ID/lingua-frontend:latest

# Deploy to GKE
echo "Deploying to GKE..."
kubectl apply -k k8s/

# Wait for deployments to be ready
echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=600s deployment/lingua-backend -n lingua-app
kubectl wait --for=condition=available --timeout=600s deployment/lingua-frontend -n lingua-app

# Get service information
echo "Getting service information..."
kubectl get services -n lingua-app

echo "Deployment completed successfully!"
echo "Frontend service will be accessible via the external IP shown above."
