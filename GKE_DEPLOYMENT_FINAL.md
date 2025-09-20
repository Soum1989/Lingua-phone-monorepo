# Final Guide: Deploying Lingua App to Google Kubernetes Engine (GKE)

Congratulations! You've successfully prepared your Lingua application for deployment to Google Kubernetes Engine (GKE). This document provides a comprehensive overview of what's been done and the steps needed to complete the deployment.

## What's Been Accomplished

### 1. Docker Configuration
- Created Dockerfiles for both frontend and backend services
- Configured Nginx for the frontend to properly route API requests to the backend
- Optimized images for production deployment

### 2. Kubernetes Manifests
- Created deployment and service configurations for both frontend and backend
- Set up proper networking with ClusterIP for backend and LoadBalancer for frontend
- Configured namespaces for better resource organization
- Prepared secrets configuration for Google Cloud credentials
- Added ConfigMaps for environment variables

### 3. Deployment Scripts
- Created automated deployment scripts for both Linux/Mac (bash) and Windows (batch)
- Developed prerequisite checking scripts to validate your environment
- Added comprehensive error handling and progress reporting

### 4. Documentation
- Created detailed deployment guides with step-by-step instructions
- Provided troubleshooting tips and common issue resolutions
- Documented scaling and maintenance procedures

## Files Created

```
lingua-phone-monorepo/
├── docker/
│   ├── backend.Dockerfile      # Backend container configuration
│   ├── frontend.Dockerfile     # Frontend container configuration
│   └── nginx.conf             # Nginx configuration for frontend
├── k8s/
│   ├── namespace.yaml         # Kubernetes namespace
│   ├── configmap.yaml         # Environment variables
│   ├── secret.yaml            # Google Cloud credentials template
│   ├── backend-deployment.yaml # Backend deployment and service
│   ├── frontend-deployment.yaml # Frontend deployment and service
│   └── kustomization.yaml     # Kustomize configuration
├── scripts/
│   ├── check-prerequisites.sh # Environment validation (Linux/Mac)
│   ├── check-prerequisites.bat # Environment validation (Windows)
│   ├── deploy-gke.sh          # Deployment script (Linux/Mac)
│   └── deploy-gke.bat         # Deployment script (Windows)
└── documentation/
    ├── GKE_DEPLOYMENT.md      # Deployment overview
    ├── DEPLOYMENT_STEPS.md    # Step-by-step instructions
    └── GKE_DEPLOYMENT_GUIDE.md # Comprehensive guide
```

## Deployment Steps

### Prerequisites
1. Google Cloud SDK installed and configured
2. Docker installed and running
3. kubectl installed
4. A Google Cloud Project with billing enabled
5. Google Cloud service account key for backend services

### Deployment Process

1. **Authenticate with Google Cloud:**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Enable Required APIs:**
   ```bash
   gcloud services enable container.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

3. **Create GKE Cluster:**
   ```bash
   gcloud container clusters create lingua-cluster \
       --zone=us-central1-a \
       --num-nodes=3 \
       --machine-type=e2-medium
   ```

4. **Configure kubectl:**
   ```bash
   gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a
   ```

5. **Prepare Google Cloud Credentials:**
   - Create a service account with required permissions
   - Download the JSON key file
   - Create Kubernetes secret:
     ```bash
     kubectl create secret generic google-cloud-key \
         --from-file=key.json=./path/to/your/key.json \
         --namespace=lingua-app
     ```

6. **Build and Push Docker Images:**
   ```bash
   # Build backend
   docker build -t lingua-backend:latest -f docker/backend.Dockerfile .

   # Build frontend
   docker build -t lingua-frontend:latest -f docker/frontend.Dockerfile .

   # Tag for GCR
   docker tag lingua-backend:latest gcr.io/YOUR_PROJECT_ID/lingua-backend:latest
   docker tag lingua-frontend:latest gcr.io/YOUR_PROJECT_ID/lingua-frontend:latest

   # Push to GCR
   docker push gcr.io/YOUR_PROJECT_ID/lingua-backend:latest
   docker push gcr.io/YOUR_PROJECT_ID/lingua-frontend:latest
   ```

7. **Deploy to Kubernetes:**
   ```bash
   # Apply all resources
   kubectl apply -k k8s/

   # Wait for deployments to be ready
   kubectl wait --for=condition=available --timeout=600s deployment/lingua-backend -n lingua-app
   kubectl wait --for=condition=available --timeout=600s deployment/lingua-frontend -n lingua-app
   ```

8. **Access Your Application:**
   ```bash
   # Get the external IP for the frontend
   kubectl get service lingua-frontend-service -n lingua-app
   ```

## Post-Deployment Verification

1. **Check Pod Status:**
   ```bash
   kubectl get pods -n lingua-app
   ```

2. **Check Service Status:**
   ```bash
   kubectl get services -n lingua-app
   ```

3. **View Logs:**
   ```bash
   # Backend logs
   kubectl logs -l app=lingua-backend -n lingua-app

   # Frontend logs
   kubectl logs -l app=lingua-frontend -n lingua-app
   ```

## Expected Outcomes

After successful deployment, you should have:

1. A fully functional Lingua application running on GKE
2. The frontend accessible via a public IP address
3. The backend API properly serving requests
4. Google Cloud Translation and Text-to-Speech working correctly
5. AI shopping assistant providing accurate product recommendations
6. Proper handling of multilingual requests (including Bengali)

## Troubleshooting

### Common Issues

1. **Image Pull Errors:**
   - Ensure images are properly tagged and pushed to GCR
   - Verify the project ID in image names is correct

2. **Permission Errors:**
   - Check that your service account has proper permissions
   - Ensure the Google Cloud key is properly mounted as a secret

3. **Networking Issues:**
   - Verify the frontend can reach the backend service
   - Check service configurations and selectors

### Useful Commands

```bash
# Describe deployments for detailed status
kubectl describe deployment lingua-backend -n lingua-app
kubectl describe deployment lingua-frontend -n lingua-app

# Port forwarding for testing
kubectl port-forward service/lingua-backend-service 8080:3002 -n lingua-app

# Scale deployments
kubectl scale deployment lingua-backend --replicas=3 -n lingua-app
```

## Next Steps

1. Test all application functionality including:
   - AI shopping assistant recommendations
   - Multilingual support
   - Text-to-Speech features
   - Product search and display

2. Monitor application performance and resource usage

3. Set up monitoring and logging solutions for production use

4. Configure domain names and SSL certificates for production deployment

5. Implement backup and disaster recovery procedures

## Conclusion

Your Lingua application is now ready for deployment to Google Kubernetes Engine. The containerized architecture, Kubernetes manifests, and deployment scripts provide a robust foundation for running your application in production.

The deployment process has been designed to be as automated as possible while still allowing for customization based on your specific requirements. The application should maintain all the functionality you've developed, including the improved AI shopping assistant, multilingual support, and Google Cloud integration.

If you encounter any issues during deployment, refer to the troubleshooting section or consult the detailed documentation provided in the documentation directory.
