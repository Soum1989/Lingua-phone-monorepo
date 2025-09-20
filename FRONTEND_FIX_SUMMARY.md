# Frontend CrashLoopBackOff Issue - Fix Summary

## Problem
The frontend pod was stuck in a CrashLoopBackOff state with the error:
```
nginx: [emerg] host not found in upstream "backend:3002" in /etc/nginx/nginx.conf:10
```

## Root Cause
The nginx configuration in the frontend container was looking for a backend service named "backend:3002", but the actual Kubernetes service was named "lingua-backend-service".

## Fixes Applied

### 1. Updated Backend Service Name
Changed the backend service name from `lingua-backend-service` to `backend` in [k8s/backend-service.yaml](file:///C:/Users/Lenovo/Lingua-phone-monorepo/k8s/backend-service.yaml):
```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend  # Changed from lingua-backend-service
spec:
  selector:
    app: lingua-backend
  ports:
    - protocol: TCP
      port: 3002
      targetPort: 3002
  type: ClusterIP
```

### 2. Updated Nginx Configuration
Modified [docker/nginx-k8s.conf](file:///C:/Users/Lenovo/Lingua-phone-monorepo/docker/nginx-k8s.conf) to use the correct backend service name:
```nginx
upstream backend {
    server backend:3002;  # Changed from lingua-backend-service:3002
}
```

### 3. Simplified Frontend Deployment
Removed the ConfigMap volume mount from [k8s/frontend-deployment.yaml](file:///C:/Users/Lenovo/Lingua-phone-monorepo/k8s/frontend-deployment.yaml) to avoid configuration conflicts:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lingua-frontend
  namespace: lingua-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: lingua-frontend
  template:
    metadata:
      labels:
        app: lingua-frontend
    spec:
      containers:
      - name: lingua-frontend
        image: gcr.io/lingua-phone/lingua-frontend:latest
        ports:
        - containerPort: 80
```

## Verification Steps

1. Run `simple-status-check.bat` to check pod status
2. Run `check-frontend-logs.bat` to verify the logs no longer show DNS resolution errors
3. Access the application at http://34.45.239.154

## Expected Outcome
After applying these fixes and redeploying, the frontend pod should show "1/1 Running" status instead of CrashLoopBackOff.