# Create Google Cloud Service Account for GKE Deployment

## Overview

This guide explains how to create a service account for your Lingua application backend and configure the Kubernetes secret.

## Steps

### 1. Create Service Account

```bash
# Create service account
gcloud iam service-accounts create lingua-backend-sa \
    --display-name="Lingua Backend Service Account"
```

### 2. Grant Required Roles

```bash
# Get your project ID
PROJECT_ID=$(gcloud config list project --format="value(core.project)")

# Grant required roles
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:lingua-backend-sa@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/cloudtranslate.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:lingua-backend-sa@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/texttospeech.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:lingua-backend-sa@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/speech.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:lingua-backend-sa@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"
```

### 3. Create and Download Service Account Key

```bash
# Create and download key
gcloud iam service-accounts keys create key.json \
    --iam-account=lingua-backend-sa@$PROJECT_ID.iam.gserviceaccount.com
```

### 4. Create Kubernetes Secret

```bash
# Create secret in Kubernetes
kubectl create secret generic google-cloud-key \
    --from-file=key.json=./key.json \
    --namespace=lingua-app
```

## Verification

After creating the secret, verify it exists:

```bash
kubectl get secret google-cloud-key -n lingua-app
```

## Security Notes

1. Keep your `key.json` file secure and never commit it to version control
2. The `.gitignore` file should already exclude `key.json`
3. For production deployments, consider using Workload Identity instead of service account keys

## Next Steps

Once you've created the service account and secret:
1. Build and push your Docker images
2. Deploy to GKE using the deployment scripts
