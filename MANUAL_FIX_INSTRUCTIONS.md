# Manual Fix Instructions for Lingua Phone Frontend Pod Issue

## Problem
The frontend pod is crashing with the error:
```
host not found in upstream "backend:3002" in /etc/nginx/nginx.conf:10
```

This indicates that the frontend container is still using the wrong nginx configuration that references `backend:3002` instead of `lingua-backend-service:3002`.

## Root Cause
The frontend Docker image is not consistently using the Kubernetes-specific nginx configuration file ([nginx-k8s.conf](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/docker/nginx-k8s.conf)) which has the correct service name.

## Solution
We need to rebuild the frontend Docker image with the correct Kubernetes-specific configuration and redeploy it.

## Manual Steps to Fix

### Step 1: Verify Configuration Files

First, verify that the configuration files have the correct content:

1. Check `docker/nginx-k8s.conf` - Should contain:
   ```
   upstream backend {
       server lingua-backend-service:3002;
   }
   ```

2. Check `docker/nginx.conf` - Should contain:
   ```
   upstream backend {
       server backend:3002;
   }
   ```

### Step 2: Rebuild and Push Docker Images

Navigate to your project root directory and run these commands:

```bash
# Get cluster credentials
gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a

# Build backend image
docker build -t gcr.io/lingua-phone/lingua-backend:latest -f docker/backend.Dockerfile .

# Build frontend image with Kubernetes-specific configuration
docker build -t gcr.io/lingua-phone/lingua-frontend:latest -f docker/frontend-k8s.Dockerfile .

# Push backend image
docker push gcr.io/lingua-phone/lingua-backend:latest

# Push frontend image
docker push gcr.io/lingua-phone/lingua-frontend:latest
```

### Step 3: Delete Existing Pods

Delete all existing pods to force Kubernetes to recreate them with the new images:

```bash
kubectl delete pods -n lingua-app --all
```

### Step 4: Monitor Pod Status

Check the pod status to see if they start correctly:

```bash
kubectl get pods -n lingua-app
```

Wait a few minutes and run the command again until you see:
- Both pods showing `1/1 Running` status
- No `CrashLoopBackOff` errors

### Step 5: Check Pod Logs (If Still Crashing)

If the frontend pod is still crashing, check the logs:

```bash
kubectl logs <frontend-pod-name> -n lingua-app
```

Replace `<frontend-pod-name>` with the actual name of your frontend pod.

### Step 6: Access the Application

Once both pods are running, get the external IP:

```bash
kubectl get services -n lingua-app
```

Access the application through the external IP of the frontend service.

## Verification

After the fix, the frontend pod logs should NOT contain:
```
host not found in upstream "backend:3002"
```

Instead, the frontend should be able to successfully connect to the backend service.

## Troubleshooting

### If the frontend pod is still crashing:

1. Double-check that the [nginx-k8s.conf](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/docker/nginx-k8s.conf) file contains the correct service name:
   ```
   upstream backend {
       server lingua-backend-service:3002;
   }
   ```

2. Verify that the [frontend-k8s.Dockerfile](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/docker/frontend-k8s.Dockerfile) is copying the correct configuration file:
   ```dockerfile
   COPY docker/nginx-k8s.conf /etc/nginx/nginx.conf
   ```

3. Check that you're building the image with the correct Dockerfile:
   ```bash
   docker build -t gcr.io/lingua-phone/lingua-frontend:latest -f docker/frontend-k8s.Dockerfile .
   ```

### If you see permission errors:

1. Ensure your Google Cloud authentication is still valid:
   ```bash
   gcloud auth list
   ```

2. If needed, re-authenticate:
   ```bash
   gcloud auth login
   ```

3. Ensure you have the correct permissions for the project:
   ```bash
   gcloud config set project lingua-phone
   ```

## Files Modified in This Fix

1. `docker/frontend-k8s.Dockerfile` - Added verification step to ensure correct configuration
2. `FINAL_FIX_SUMMARY.md` - Updated with latest fix information
3. Created new scripts:
   - `rebuild-and-redeploy.py`
   - `rebuild-and-redeploy.bat`
   - `check-deployment-status.py`

## Expected Outcome

After following these steps:
- The frontend pod should no longer crash with `CrashLoopBackOff`
- Both frontend and backend pods should show `1/1 Running` status
- The application should be accessible through the external IP
- All shopping assistant functionalities should work correctly