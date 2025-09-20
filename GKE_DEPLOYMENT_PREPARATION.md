# GKE Deployment Preparation Guide

## Current Status
✅ All required files are present
⚠️ Placeholder values need to be replaced
⚠️ Google Cloud SDK needs to be installed
⚠️ Docker images need to be built and pushed to container registry

## Steps to Prepare for GKE Deployment

### 1. Install Google Cloud SDK
Since the `gcloud` command is not recognized, you need to install the Google Cloud SDK:
- Download from: https://cloud.google.com/sdk/docs/install
- Follow the installation instructions for Windows
- After installation, restart your terminal/PowerShell

### 2. Replace Placeholder Values
The following files contain placeholder values that need to be replaced:

#### In `k8s/ai-shopping-deployment.yaml`:
- Replace `YOUR_PROJECT_ID` with your actual Google Cloud project ID
- Replace `gcr.io/YOUR_PROJECT_ID/lingua-ai-backend:latest` with your actual image path
- Replace `gcr.io/YOUR_PROJECT_ID/lingua-ai-frontend:latest` with your actual image path

#### In `k8s/backend-deployment.yaml`:
- Replace `YOUR_PROJECT_ID` with your actual Google Cloud project ID
- Replace `gcr.io/YOUR_PROJECT_ID/lingua-backend:latest` with your actual image path

#### In `k8s/frontend-deployment.yaml`:
- Replace `YOUR_PROJECT_ID` with your actual Google Cloud project ID
- Replace `gcr.io/YOUR_PROJECT_ID/lingua-frontend:latest` with your actual image path

### 3. Set Up Google Cloud Project
```bash
# Authenticate with Google Cloud
gcloud auth login

# Set your project ID
gcloud config set project YOUR_ACTUAL_PROJECT_ID

# Enable required APIs
gcloud services enable containerregistry.googleapis.com
gcloud services enable container.googleapis.com
```

### 4. Build and Push Docker Images
```bash
# Build backend image
docker build -t gcr.io/YOUR_PROJECT_ID/lingua-backend:latest -f docker/backend.Dockerfile .

# Build frontend image
docker build -t gcr.io/YOUR_PROJECT_ID/lingua-frontend:latest -f docker/frontend.Dockerfile .

# Push images to Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/lingua-backend:latest
docker push gcr.io/YOUR_PROJECT_ID/lingua-frontend:latest
```

### 5. Create Required Secrets
```bash
# Create a secret for your Gemini API key
kubectl create secret generic ai-secrets --from-literal=gemini-api-key=YOUR_ACTUAL_GEMINI_API_KEY

# If using Google Cloud services, create a service account key and secret
kubectl create secret generic google-cloud-key --from-file=key.json=PATH_TO_YOUR_SERVICE_ACCOUNT_KEY.json
```

### 6. Deploy to GKE
```bash
# Apply all Kubernetes manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get services
```

## Verification Checklist
- [ ] Google Cloud SDK installed and configured
- [ ] Project ID replaced in all YAML files
- [ ] Docker images built and pushed to container registry
- [ ] Required secrets created
- [ ] All Kubernetes manifests applied successfully

## Next Steps
1. Install Google Cloud SDK
2. Replace placeholder values in Kubernetes manifests
3. Build and push Docker images
4. Create required secrets
5. Deploy to GKE cluster
