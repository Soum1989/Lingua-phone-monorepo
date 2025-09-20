# Quick Start: Deploy Lingua App to GKE

This guide provides the fastest path to deploy your Lingua application to Google Kubernetes Engine (GKE).

## Prerequisites

Ensure you have:
- Google Cloud SDK installed
- Docker installed and running
- kubectl installed
- A Google Cloud Project with billing enabled

## Quick Deployment Steps

### 1. Set Up Google Cloud

```bash
# Authenticate
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Enable APIs
gcloud services enable container.googleapis.com containerregistry.googleapis.com
```

### 2. Create GKE Cluster

```bash
gcloud container clusters create lingua-cluster \
    --zone=us-central1-a \
    --num-nodes=3 \
    --machine-type=e2-medium
```

### 3. Configure kubectl

```bash
gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a
```

### 4. Create Google Cloud Service Account

```bash
# Create service account
gcloud iam service-accounts create lingua-backend-sa

# Grant permissions (adjust as needed)
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:lingua-backend-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/cloudtranslate.user"

# Create and download key
gcloud iam service-accounts keys create key.json \
    --iam-account=lingua-backend-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### 5. Create Kubernetes Secret

```bash
kubectl create secret generic google-cloud-key \
    --from-file=key.json=./key.json \
    --namespace=lingua-app
```

### 6. Build and Push Images

```bash
# Build
docker build -t lingua-backend:latest -f docker/backend.Dockerfile .
docker build -t lingua-frontend:latest -f docker/frontend.Dockerfile .

# Tag
docker tag lingua-backend:latest gcr.io/YOUR_PROJECT_ID/lingua-backend:latest
docker tag lingua-frontend:latest gcr.io/YOUR_PROJECT_ID/lingua-frontend:latest

# Push
docker push gcr.io/YOUR_PROJECT_ID/lingua-backend:latest
docker push gcr.io/YOUR_PROJECT_ID/lingua-frontend:latest
```

### 7. Deploy to GKE

```bash
kubectl apply -k k8s/
```

### 8. Get Application URL

```bash
kubectl get service lingua-frontend-service -n lingua-app
```

## You're Done!

Access your application using the external IP shown in step 8. The Lingua app with its AI shopping assistant should now be running on GKE.

For detailed instructions and troubleshooting, see [GKE_DEPLOYMENT_GUIDE.md](documentation/GKE_DEPLOYMENT_GUIDE.md).
