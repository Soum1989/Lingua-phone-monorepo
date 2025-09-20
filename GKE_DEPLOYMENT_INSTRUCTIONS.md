# GKE Deployment Instructions for Lingua Phone Application

This document provides step-by-step instructions for deploying the Lingua Phone application to Google Kubernetes Engine (GKE).

## Prerequisites

Before deploying, ensure you have:
1. Google Cloud SDK installed and configured
2. kubectl installed and configured
3. Docker installed and running
4. Valid Google Cloud credentials with appropriate permissions
5. The GKE cluster already created (lingua-cluster)

## Deployment Steps

### 1. Verify Cluster Connection

First, verify that you're connected to the correct GKE cluster:

```bash
gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a
kubectl get nodes
```

### 2. Create Namespace

Create the namespace for the application:

```bash
kubectl create namespace lingua-app
```

### 3. Create Secret for Google Cloud Credentials

Create a secret containing your Google Cloud service account key:

```bash
kubectl create secret generic google-cloud-key --from-file=key.json=packages/backend/keys/service-account.json --namespace=lingua-app
```

### 4. Build Docker Images

Build the backend and frontend Docker images:

```bash
# Build backend image
docker build -t lingua-backend:latest -f docker/backend.Dockerfile .

# Build frontend image
docker build -t lingua-frontend:latest -f docker/frontend.Dockerfile .
```

### 5. Deploy Application to GKE

Apply the Kubernetes manifests:

```bash
kubectl apply -k k8s/
```

### 6. Verify Deployment

Check the status of your deployment:

```bash
kubectl get pods -n lingua-app
```

All pods should be in the "Running" state.

## Troubleshooting

### If the namespace already exists

If you get an error that the namespace already exists, you can skip the namespace creation step or delete the existing namespace first:

```bash
kubectl delete namespace lingua-app
kubectl create namespace lingua-app
```

### If the secret already exists

If you get an error that the secret already exists, you can delete the existing secret first:

```bash
kubectl delete secret google-cloud-key --namespace=lingua-app
kubectl create secret generic google-cloud-key --from-file=key.json=packages/backend/keys/service-account.json --namespace=lingua-app
```

### If you encounter permission issues

Ensure your Google Cloud service account has the necessary permissions:
1. Cloud Text-to-Speech API User
2. Cloud Translation API User
3. Storage Object Viewer (if using Cloud Storage)

## Accessing the Application

After successful deployment, you can access the application using the external IP of the frontend service:

```bash
kubectl get services -n lingua-app
```

Look for the frontend service and note its external IP. The application will be accessible at `http://<EXTERNAL-IP>:80`.

## Updating the Application

To update the application after making changes:

1. Rebuild the Docker images:
   ```bash
   docker build -t lingua-backend:latest -f docker/backend.Dockerfile .
   docker build -t lingua-frontend:latest -f docker/frontend.Dockerfile .
   ```

2. Delete the existing pods to trigger recreation with new images:
   ```bash
   kubectl delete pods --all -n lingua-app
   ```

## Cleaning Up

To delete the entire application deployment:

```bash
kubectl delete namespace lingua-app
```

This will remove all resources associated with the application.
