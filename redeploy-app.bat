@echo off
echo Building and deploying Lingua Phone application to GKE...

echo 1. Building and pushing Docker images...
call build-and-push-images.bat

echo 2. Updating Kubernetes deployments...
kubectl apply -k k8s/

echo 3. Waiting for pods to be ready...
kubectl rollout status deployment/lingua-frontend -n lingua-app
kubectl rollout status deployment/lingua-backend -n lingua-app

echo 4. Checking pod status...
kubectl get pods -n lingua-app

echo Deployment completed!