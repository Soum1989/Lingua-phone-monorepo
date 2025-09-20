# Complete GKE Deployment Steps

## Overview

This document provides step-by-step instructions for deploying the Lingua application to Google Kubernetes Engine (GKE).

## Prerequisites

Before starting, ensure you have:
1. Verified all prerequisites (see VERIFY_GKE_PREREQUISITES.md)
2. Updated configuration files with your project ID
3. Created the service account and Kubernetes secret

## Deployment Steps

### 1. Authenticate and Set Project

```bash
# Authenticate with Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID
```

### 2. Create GKE Cluster

```bash
gcloud container clusters create lingua-cluster \
    --zone=us-central1-a \
    --num-nodes=3 \
    --machine-type=e2-medium \
    --enable-autoscaling \
    --min-nodes=1 \
    --max-nodes=5 \
    --enable-autorepair \
    --enable-autoupgrade
```

### 3. Configure kubectl

```bash
gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a
```

### 4. Build and Push Docker Images

```bash
# Build backend image
docker build -t lingua-backend:latest -f docker/backend.Dockerfile .

# Build frontend image
docker build -t lingua-frontend:latest -f docker/frontend.Dockerfile .

# Get project ID
PROJECT_ID=$(gcloud config list project --format="value(core.project)")

# Tag images for Google Container Registry
docker tag lingua-backend:latest gcr.io/$PROJECT_ID/lingua-backend:latest
docker tag lingua-frontend:latest gcr.io/$PROJECT_ID/lingua-frontend:latest

# Push images to GCR
docker push gcr.io/$PROJECT_ID/lingua-backend:latest
docker push gcr.io/$PROJECT_ID/lingua-frontend:latest
```

### 5. Deploy to Kubernetes

```bash
# Apply all resources
kubectl apply -k k8s/

# Wait for deployments to be ready
kubectl wait --for=condition=available --timeout=600s deployment/lingua-backend -n lingua-app
kubectl wait --for=condition=available --timeout=600s deployment/lingua-frontend -n lingua-app
```

### 6. Verify Deployment

```bash
# Check pods
kubectl get pods -n lingua-app

# Check services
kubectl get services -n lingua-app
```

### 7. Access Your Application

```bash
# Get the external IP for the frontend
kubectl get service lingua-frontend-service -n lingua-app
```

The frontend will be accessible at the external IP shown in the output.

## Troubleshooting

### Common Issues

1. **Image pull errors**: Ensure images were pushed to GCR successfully
2. **Permission errors**: Verify the service account has the correct roles
3. **Pods stuck in pending**: Check cluster resources and node pool configuration

### Debugging Commands

```bash
# Check pod logs
kubectl logs -n lingua-app deployment/lingua-backend
kubectl logs -n lingua-app deployment/lingua-frontend

# Describe pods for detailed status
kubectl describe pods -n lingua-app

# Check events
kubectl get events -n lingua-app
```

## Post-Deployment

### 1. Test Application Functionality

1. Access the frontend via the external IP
2. Test the shopping assistant with various queries
3. Verify multilingual support works
4. Test Google Cloud TTS functionality

### 2. Monitor Resources

```bash
# Check resource usage
kubectl top nodes
kubectl top pods -n lingua-app
```

## Cleanup (Optional)

If you need to remove the deployment:

```bash
# Delete all resources
kubectl delete -k k8s/

# Delete cluster
gcloud container clusters delete lingua-cluster --zone=us-central1-a
```

## Next Steps

Once deployment is successful:
1. Test all application features
2. Prepare for hackathon submission
3. Create demo video
4. Document findings and learnings
