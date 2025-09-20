#!/bin/bash

# This script updates all GKE configuration files with your actual project ID
# Usage: ./UPDATE_GKE_CONFIG.sh YOUR_PROJECT_ID

if [ $# -eq 0 ]; then
    echo "Usage: $0 YOUR_PROJECT_ID"
    echo "Please provide your Google Cloud Project ID as an argument"
    exit 1
fi

PROJECT_ID=$1
echo "Updating configuration files with project ID: $PROJECT_ID"

# Update deployment files
echo "Updating backend deployment..."
sed -i "s/your-project-id/$PROJECT_ID/g" k8s/backend-deployment.yaml

echo "Updating frontend deployment..."
sed -i "s/your-project-id/$PROJECT_ID/g" k8s/frontend-deployment.yaml

echo "Updating deploy-gke.sh..."
sed -i "s/your-gcp-project-id/$PROJECT_ID/g" deploy-gke.sh

echo "Updating deploy-gke.bat..."
sed -i "s/your-gcp-project-id/$PROJECT_ID/g" deploy-gke.bat

echo "Configuration files updated successfully!"

echo "Next steps:"
echo "1. Create your Google Cloud service account and key"
echo "2. Create the Kubernetes secret"
echo "3. Run the deployment script"