# Manual Deployment Instructions for Lingua Phone Application

Due to terminal issues with PowerShell, please follow these manual steps to deploy the application with all the fixes we've implemented.

## Prerequisites
1. Ensure you have the following tools installed:
   - Docker
   - kubectl
   - gcloud CLI
2. Ensure you're authenticated with Google Cloud:
   ```
   gcloud auth login
   ```

## Step-by-Step Deployment Instructions

### 1. Get Cluster Credentials
First, get the credentials for your GKE cluster:
```
gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a
```

### 2. Build and Push Docker Images

Navigate to your project root directory and run the following commands:

#### Build and push the backend image:
```
docker build -t gcr.io/lingua-phone/lingua-backend:latest -f docker/backend.Dockerfile .
docker push gcr.io/lingua-phone/lingua-backend:latest
```

#### Build and push the frontend image:
```
docker build -t gcr.io/lingua-phone/lingua-frontend:latest -f docker/frontend-k8s.Dockerfile .
docker push gcr.io/lingua-phone/lingua-frontend:latest
```

### 3. Apply Kubernetes Manifests
Apply all the Kubernetes manifests using kustomize:
```
kubectl apply -k k8s/
```

### 4. Verify Deployment

#### Check pod status:
```
kubectl get pods -n lingua-app
```

You should see output similar to:
```
NAME                               READY   STATUS    RESTARTS   AGE
lingua-backend-866f7c48b4-rxz9m    1/1     Running   0          5m
lingua-frontend-578867dfc7-f57xf   1/1     Running   0          5m
```

Note that both pods should show `1/1 Running` status, not `CrashLoopBackOff`.

#### Check services:
```
kubectl get services -n lingua-app
```

You should see the frontend service with an external IP:
```
NAME                      TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)        AGE
lingua-backend-service    ClusterIP      10.0.0.1      <none>          3002/TCP       5m
lingua-frontend-service   LoadBalancer   10.0.0.2      34.123.45.67    80:31234/TCP   5m
```

### 5. Access the Application
Once the frontend service has an external IP, you can access the application by navigating to that IP address in your web browser.

## Troubleshooting

### If the frontend pod is still crashing:

1. Check the pod logs:
   ```
   kubectl logs <frontend-pod-name> -n lingua-app
   ```
   Replace `<frontend-pod-name>` with the actual name of your frontend pod.

2. Check the pod description:
   ```
   kubectl describe pod <frontend-pod-name> -n lingua-app
   ```

3. Verify the backend service is running:
   ```
   kubectl get services -n lingua-app
   ```

4. Check if the backend pod is running:
   ```
   kubectl get pods -n lingua-app
   ```

### Common Issues and Solutions

#### Issue: Service name mismatch
**Solution**: We've already fixed this by ensuring the backend service name in `k8s/backend-service.yaml` matches the references in the nginx configuration.

#### Issue: Nginx configuration problems
**Solution**: We've updated both the ConfigMap and the standalone nginx configuration file to use the correct backend service name.

#### Issue: Volume mount problems
**Solution**: We've simplified the frontend deployment by embedding the nginx configuration directly in the Docker image, removing the need for volume mounts.

## Summary of Fixes Applied

1. **Fixed backend service name**: Changed from `lingua-backend` to `lingua-backend-service` in `k8s/backend-service.yaml`
2. **Updated nginx configuration**: Ensured all references to the backend service use `lingua-backend-service:3002`
3. **Simplified frontend deployment**: Removed volume mounts and embedded configuration in the Docker image
4. **Created Kubernetes-specific Dockerfile**: `docker/frontend-k8s.Dockerfile` for the frontend

## Files to Verify

Make sure the following files contain the correct configurations:

1. `k8s/backend-service.yaml` - Should have `name: lingua-backend-service`
2. `k8s/configmap.yaml` - Should contain nginx configuration with `server lingua-backend-service:3002;`
3. `docker/nginx-k8s.conf` - Should contain `server lingua-backend-service:3002;`
4. `docker/frontend-k8s.Dockerfile` - Should copy the nginx-k8s.conf file
5. `k8s/frontend-deployment.yaml` - Should use the Kubernetes-specific image and not have volume mounts

After following these steps, your frontend pod should no longer be crashing and the application should be accessible through the external IP of the frontend service.