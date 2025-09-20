# Complete Guide to Deploying Lingua App on Google Kubernetes Engine (GKE)

## Overview

This guide provides step-by-step instructions for deploying the Lingua application to Google Kubernetes Engine (GKE). The application consists of a frontend (React) and backend (Node.js) service.

## Prerequisites

Before you begin, ensure you have:

1. A Google Cloud Platform (GCP) account with billing enabled
2. Google Cloud SDK installed and configured
3. Docker installed and running
4. kubectl installed
5. A valid Google Cloud service account key for the backend (for Google APIs)

## Project Structure

```
lingua-phone-monorepo/
├── packages/
│   ├── backend/
│   └── frontend/
├── docker/
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── nginx.conf
├── k8s/
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── kustomization.yaml
├── deploy-gke.sh
└── deploy-gke.bat
```

## Step 1: Prepare Your Google Cloud Environment

### 1.1 Authenticate with Google Cloud

```bash
gcloud auth login
```

### 1.2 Set Your Project

```bash
gcloud config set project YOUR_PROJECT_ID
```

### 1.3 Enable Required APIs

```bash
gcloud services enable \
    container.googleapis.com \
    containerregistry.googleapis.com \
    translate.googleapis.com \
    texttospeech.googleapis.com
```

### 1.4 Create a Service Account for the Backend

```bash
# Create service account
gcloud iam service-accounts create lingua-backend-sa \
    --display-name="Lingua Backend Service Account"

# Grant required roles
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:lingua-backend-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/cloudtranslate.user"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:lingua-backend-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/texttospeech.user"

# Create and download key
gcloud iam service-accounts keys create key.json \
    --iam-account=lingua-backend-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

## Step 2: Prepare Kubernetes Secrets

### 2.1 Create Secret from Service Account Key

```bash
# Create secret in Kubernetes
kubectl create secret generic google-cloud-key \
    --from-file=key.json=./key.json \
    --namespace=lingua-app
```

## Step 3: Update Configuration Files

### 3.1 Update Project ID in Deployment Files

Replace `your-project-id` in the following files:
- [k8s/backend-deployment.yaml](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/k8s/backend-deployment.yaml)
- [k8s/frontend-deployment.yaml](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/k8s/frontend-deployment.yaml)

### 3.2 Update Secret (Optional)

If you want to manually update the secret instead of creating it via kubectl:

1. Base64 encode your service account key:
   ```bash
   cat key.json | base64
   ```

2. Update [k8s/secret.yaml](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/k8s/secret.yaml) with the encoded content:
   ```yaml
   data:
     key.json: <base64-encoded-content>
   ```

## Step 4: Create GKE Cluster

```bash
gcloud container clusters create lingua-cluster \
    --zone=us-central1-a \
    --num-nodes=3 \
    --machine-type=e2-medium \
    --enable-autoscaling \
    --min-nodes=1 \
    --max-nodes=5
```

## Step 5: Configure kubectl

```bash
gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a
```

## Step 6: Build and Push Docker Images

### 6.1 Build Backend Image

```bash
docker build -t lingua-backend:latest -f docker/backend.Dockerfile .
```

### 6.2 Build Frontend Image

```bash
docker build -t lingua-frontend:latest -f docker/frontend.Dockerfile .
```

### 6.3 Tag Images for Google Container Registry

```bash
docker tag lingua-backend:latest gcr.io/YOUR_PROJECT_ID/lingua-backend:latest
docker tag lingua-frontend:latest gcr.io/YOUR_PROJECT_ID/lingua-frontend:latest
```

### 6.4 Push Images to GCR

```bash
docker push gcr.io/YOUR_PROJECT_ID/lingua-backend:latest
docker push gcr.io/YOUR_PROJECT_ID/lingua-frontend:latest
```

## Step 7: Deploy to Kubernetes

### 7.1 Apply All Resources

```bash
kubectl apply -k k8s/
```

### 7.2 Verify Deployment

```bash
# Check pods
kubectl get pods -n lingua-app

# Check services
kubectl get services -n lingua-app
```

## Step 8: Access Your Application

### 8.1 Get External IP

```bash
kubectl get service lingua-frontend-service -n lingua-app
```

The frontend will be accessible at the external IP shown in the output.

### 8.2 Test Backend API

You can test the backend API by port-forwarding:

```bash
kubectl port-forward service/lingua-backend-service 8080:3002 -n lingua-app
```

Then test with curl:

```bash
curl -X POST http://localhost:8080/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message":"I am looking for a women's t-shirt","language":"en"}'
```

## Monitoring and Troubleshooting

### View Logs

```bash
# Backend logs
kubectl logs -l app=lingua-backend -n lingua-app

# Frontend logs
kubectl logs -l app=lingua-frontend -n lingua-app
```

### Describe Resources

```bash
# Describe deployments
kubectl describe deployment lingua-backend -n lingua-app
kubectl describe deployment lingua-frontend -n lingua-app

# Describe services
kubectl describe service lingua-backend-service -n lingua-app
kubectl describe service lingua-frontend-service -n lingua-app
```

## Scaling the Application

### Scale Deployments

```bash
# Scale backend
kubectl scale deployment lingua-backend --replicas=3 -n lingua-app

# Scale frontend
kubectl scale deployment lingua-frontend --replicas=3 -n lingua-app
```

## Updating the Application

### 1. Rebuild and Push New Images

```bash
# Rebuild backend with new tag
docker build -t lingua-backend:latest -f docker/backend.Dockerfile .
docker tag lingua-backend:latest gcr.io/YOUR_PROJECT_ID/lingua-backend:v2
docker push gcr.io/YOUR_PROJECT_ID/lingua-backend:v2

# Rebuild frontend with new tag
docker build -t lingua-frontend:latest -f docker/frontend.Dockerfile .
docker tag lingua-frontend:latest gcr.io/YOUR_PROJECT_ID/lingua-frontend:v2
docker push gcr.io/YOUR_PROJECT_ID/lingua-frontend:v2
```

### 2. Update Deployment Files

Update the image tags in:
- [k8s/backend-deployment.yaml](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/k8s/backend-deployment.yaml)
- [k8s/frontend-deployment.yaml](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/k8s/frontend-deployment.yaml)

### 3. Apply Updated Deployments

```bash
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

## Cleaning Up

### Delete All Resources

```bash
kubectl delete -k k8s/
```

### Delete Cluster

```bash
gcloud container clusters delete lingua-cluster --zone=us-central1-a
```

## Cost Optimization Tips

1. Use smaller machine types for development clusters
2. Enable autoscaling to automatically adjust the number of nodes
3. Use resource requests and limits in your deployments
4. Consider using preemptible nodes for non-critical workloads
5. Delete clusters when not in use

## Security Considerations

1. Use Kubernetes namespaces to isolate applications
2. Regularly rotate service account keys
3. Use Kubernetes secrets for sensitive information
4. Apply the principle of least privilege for service accounts
5. Enable Kubernetes role-based access control (RBAC)
