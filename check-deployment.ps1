# Check if namespace exists, create if not
Write-Host "1. Checking if namespace lingua-app exists..."
$namespace = kubectl get namespace lingua-app -o name 2>$null
if ($namespace) {
    Write-Host "   Namespace lingua-app already exists."
} else {
    Write-Host "   Creating namespace lingua-app..."
    kubectl create namespace lingua-app
    if ($?) {
        Write-Host "   Namespace lingua-app created successfully."
    } else {
        Write-Host "   Failed to create namespace lingua-app."
        exit 1
    }
}

# Create secret for Google Cloud credentials
Write-Host "2. Creating secret for Google Cloud credentials..."
kubectl create secret generic google-cloud-key --from-file=key.json=packages/backend/keys/service-account.json --namespace=lingua-app
if ($?) {
    Write-Host "   Secret google-cloud-key created successfully."
} else {
    Write-Host "   Failed to create secret google-cloud-key."
    exit 1
}

# Build Docker images
Write-Host "3. Building Docker images..."
Write-Host "   Building backend image..."
docker build -t lingua-backend:latest -f docker/backend.Dockerfile .
if ($?) {
    Write-Host "   Backend image built successfully."
} else {
    Write-Host "   Failed to build backend image."
    exit 1
}

Write-Host "   Building frontend image..."
docker build -t lingua-frontend:latest -f docker/frontend.Dockerfile .
if ($?) {
    Write-Host "   Frontend image built successfully."
} else {
    Write-Host "   Failed to build frontend image."
    exit 1
}

# Deploy application to GKE
Write-Host "4. Deploying application to GKE..."
kubectl apply -k k8s/
if ($?) {
    Write-Host "   Application deployed successfully."
} else {
    Write-Host "   Failed to deploy application."
    exit 1
}

Write-Host ""
Write-Host "Deployment completed successfully!"
Write-Host "You can check the status of your deployment with:"
Write-Host "   kubectl get pods -n lingua-app"