#!/bin/bash

echo "Checking prerequisites for GKE deployment..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null
then
    echo "❌ gcloud is not installed. Please install Google Cloud SDK."
    exit 1
else
    echo "✅ gcloud is installed"
    gcloud version | head -1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null
then
    echo "❌ kubectl is not installed. Please install kubectl."
    exit 1
else
    echo "✅ kubectl is installed"
    kubectl version --client
fi

# Check if docker is installed
if ! command -v docker &> /dev/null
then
    echo "❌ docker is not installed. Please install Docker."
    exit 1
else
    echo "✅ docker is installed"
    docker --version
fi

# Check if gcloud is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .
then
    echo "⚠️  gcloud is not authenticated. Please run 'gcloud auth login'"
else
    echo "✅ gcloud is authenticated"
fi

# Check if gcloud project is set
PROJECT_ID=$(gcloud config list project --format="value(core.project)" 2>/dev/null)
if [ -z "$PROJECT_ID" ]
then
    echo "⚠️  gcloud project is not set. Please run 'gcloud config set project YOUR_PROJECT_ID'"
else
    echo "✅ gcloud project is set to: $PROJECT_ID"
fi

echo "Prerequisites check completed."