# Deploying Lingua App to Google Kubernetes Engine (GKE)

This guide will help you deploy the Lingua application to Google Kubernetes Engine (GKE).

## Prerequisites

1. Google Cloud SDK installed and configured
2. Docker installed
3. kubectl installed
4. A Google Cloud Project with billing enabled
5. Kubernetes Engine API enabled in your project

## Setup Instructions

### 1. Configure Google Cloud

```bash
# Authenticate with Google Cloud
gcloud auth login

# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable container.googleapis.com
```

### 2. Update Configuration

Before deploying, update the following files with your specific configuration:

1. `deploy-gke.sh` or `deploy-gke.bat`:
   - Set `PROJECT_ID` to your Google Cloud Project ID
   - Adjust `CLUSTER_NAME`, `ZONE`, and `REGION` as needed

### 3. Deploy to GKE

#### Using Bash (Linux/Mac):
```bash
chmod +x deploy-gke.sh
./deploy-gke.sh
```

#### Using Batch (Windows):
```cmd
deploy-gke.bat
```

## What the Deployment Script Does

1. Creates a GKE cluster (if it doesn't exist)
2. Builds Docker images for frontend and backend
3. Tags and pushes images to Google Container Registry
4. Deploys the application using Kubernetes manifests
5. Waits for deployments to be ready
6. Shows service information including external IP for the frontend

## Accessing the Application

After deployment, the frontend will be accessible via the external IP shown in the service information. The backend API will be accessible internally within the cluster.

## Troubleshooting

### Common Issues

1. **Insufficient permissions**: Ensure your Google Cloud account has the necessary permissions to create clusters and push to Container Registry.

2. **Resource quotas**: Check that your project has sufficient quotas for the resources being requested.

3. **Docker build failures**: Ensure all dependencies are correctly specified in package.json files.

### Useful Commands

```bash
# Check pod status
kubectl get pods -n lingua-app

# Check service status
kubectl get services -n lingua-app

# View logs for backend
kubectl logs deployment/lingua-backend -n lingua-app

# View logs for frontend
kubectl logs deployment/lingua-frontend -n lingua-app

# Describe deployments
kubectl describe deployment lingua-backend -n lingua-app
kubectl describe deployment lingua-frontend -n lingua-app
```

## Cleaning Up

To delete the cluster and all resources:

```bash
gcloud container clusters delete lingua-cluster --zone=us-central1-a
```

## Customization

You can customize the deployment by modifying the Kubernetes manifests in the `k8s/` directory:

- Adjust replica counts in deployment files
- Modify resource requests and limits
- Update environment variables in the ConfigMap
- Change service types (LoadBalancer, NodePort, ClusterIP)
