# GKE Deployment Prerequisites Verification

## Tools Required

Before deploying to GKE, ensure you have the following tools installed:

1. **Google Cloud SDK** - For authentication and GKE management
2. **Docker** - For building container images
3. **kubectl** - For Kubernetes cluster management

## Verification Steps

### 1. Check Google Cloud SDK

```bash
gcloud version
```

If not installed, download from: https://cloud.google.com/sdk/docs/install

### 2. Check Docker

```bash
docker --version
```

If not installed, download from: https://docs.docker.com/get-docker/

### 3. Check kubectl

```bash
kubectl version --client
```

If not installed, install with:
```bash
gcloud components install kubectl
```

## Authentication

### 1. Authenticate with Google Cloud

```bash
gcloud auth login
```

### 2. Set Your Project

```bash
gcloud config set project YOUR_PROJECT_ID
```

Replace `YOUR_PROJECT_ID` with your actual Google Cloud project ID.

### 3. Enable Required APIs

```bash
gcloud services enable \
    container.googleapis.com \
    containerregistry.googleapis.com \
    translate.googleapis.com \
    texttospeech.googleapis.com \
    speech.googleapis.com \
    generativelanguage.googleapis.com
```

## Next Steps

Once all prerequisites are verified, proceed with the deployment steps in DEPLOYMENT_STEPS.md.
