# Lingua Phone - Deployment Options

Since you have Miniconda installed, you have several options for deploying your application:

## Option 1: Use the Miniconda Deployment Script (Recommended)

This is the recommended approach since you have Miniconda installed:

1. First, check if Miniconda is properly set up:
   ```
   check-miniconda-setup.bat
   ```

2. If everything is set up correctly, run the deployment script:
   ```
   complete-deployment-miniconda.bat
   ```

## Option 2: Use the Python Deployment Helper

Run the interactive Python deployment helper:

1. Make sure you're in the project directory
2. Run:
   ```
   run-deployment-helper.bat
   ```

3. Follow the on-screen instructions to either check status or deploy

## Option 3: Manual Deployment Steps

If you prefer to run commands manually:

1. Authenticate with Google Cloud:
   ```
   gcloud auth login
   ```

2. Set your project:
   ```
   gcloud config set project lingua-phone
   ```

3. Get cluster credentials:
   ```
   gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a
   ```

4. Build and push Docker images:
   ```
   docker build -t lingua-backend:latest -f docker/backend.Dockerfile .
   docker build -t lingua-frontend:latest -f docker/frontend-k8s.Dockerfile .
   
   docker tag lingua-backend:latest gcr.io/lingua-phone/lingua-backend:latest
   docker tag lingua-frontend:latest gcr.io/lingua-phone/lingua-frontend:latest
   
   docker push gcr.io/lingua-phone/lingua-backend:latest
   docker push gcr.io/lingua-phone/lingua-frontend:latest
   ```

5. Deploy to GKE:
   ```
   kubectl apply -k k8s/
   ```

6. Check the status:
   ```
   kubectl get pods -n lingua-app
   kubectl get services -n lingua-app
   ```

## Option 4: Deployment Without Python

If you encounter any issues with Python, you can use the script that doesn't require Python:

```
complete-deployment-no-python.bat
```

## Troubleshooting

If the frontend pod is still in CrashLoopBackOff status:

1. Check the logs:
   ```
   kubectl logs <frontend-pod-name> -n lingua-app
   ```

2. Verify the nginx configuration in `docker/nginx-k8s.conf` contains:
   ```
   server lingua-backend-service:3002;
   ```

3. Make sure the Google Cloud TTS is properly configured with the service account

## Expected Results

After successful deployment:
- Both pods should show "1/1 Running" status
- The frontend service should have an external IP assigned
- No more "CrashLoopBackOff" errors