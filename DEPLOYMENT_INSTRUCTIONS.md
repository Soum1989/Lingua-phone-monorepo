# Frontend Deployment Instructions

## Prerequisites

1. Google Cloud SDK installed and configured
2. Docker installed and running
3. kubectl installed and configured with your GKE cluster
4. Access to the Google Cloud project

## Deployment Steps

### Option 1: Manual Deployment

1. **Build the frontend image**:
   ```bash
   docker build -t gcr.io/YOUR_PROJECT_ID/lingua-frontend:latest -f docker/frontend.Dockerfile .
   ```

2. **Push the image to Google Container Registry**:
   ```bash
   docker push gcr.io/YOUR_PROJECT_ID/lingua-frontend:latest
   ```

3. **Deploy to GKE**:
   ```bash
   kubectl apply -f k8s/frontend-deployment.yaml
   ```

4. **Verify the deployment**:
   ```bash
   kubectl get pods -n lingua-app
   ```

### Option 2: Automated Deployment with Cloud Build

1. **Trigger Cloud Build**:
   ```bash
   gcloud builds submit --config cloudbuild.yaml .
   ```

2. **Deploy to GKE** (if not automatically done by cloudbuild.yaml):
   ```bash
   kubectl apply -f k8s/frontend-deployment.yaml
   ```

3. **Verify the deployment**:
   ```bash
   kubectl get pods -n lingua-app
   ```

## Troubleshooting

### Common Issues

1. **COPY failed: no source files were specified**
   - This was fixed by correcting the paths in [docker/frontend.Dockerfile](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/docker/frontend-k8s.Dockerfile).
   - Ensure you're building from the root of the repository and that the paths in the Dockerfile are correct.

2. **Image pull errors**
   - Verify that the image name in [k8s/frontend-deployment.yaml](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/k8s/frontend-deployment.yaml) matches the image you built and pushed.
   - Check that the image exists in Google Container Registry.

3. **Pod stuck in CrashLoopBackOff**
   - Check pod logs: `kubectl logs POD_NAME -n lingua-app`
   - Verify nginx configuration in [docker/nginx-k8s.conf](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/docker/nginx-k8s.conf)

## Files Overview

- **[docker/frontend.Dockerfile](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/docker/frontend-k8s.Dockerfile)**: Dockerfile for building the frontend image
- **[cloudbuild.yaml](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/cloudbuild.yaml)**: Cloud Build configuration for automated builds
- **[k8s/frontend-deployment.yaml](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/k8s/frontend-deployment.yaml)**: Kubernetes deployment configuration
- **[docker/nginx-k8s.conf](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/docker/nginx-k8s.conf)**: Nginx configuration for the frontend in Kubernetes

## Cleanup

To remove unused files and simplify the repository:
1. Remove redundant batch files and documentation
2. Delete the shopping-cart directory if not needed
