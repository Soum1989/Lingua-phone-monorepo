#!/bin/bash

# GKE Deployment Verification Script

echo "🔍 Verifying GKE Deployment Readiness..."

# Check if required files exist
echo "📁 Checking required files..."
REQUIRED_FILES=(
    
    "k8s/ai-shopping-deployment.yaml"
    "k8s/backend-deployment.yaml"
    "k8s/frontend-deployment.yaml"
    "k8s/backend-service.yaml"
    "k8s/frontend-service.yaml"
    "k8s/ingress.yaml"
    "k8s/hpa.yaml"
    "docker/backend.Dockerfile"
    "docker/frontend.Dockerfile"
    "GKE_DEPLOYMENT_GUIDE.md"
    "GKE_DEPLOYMENT_CHECKLIST.md"
    "ARCHITECTURE_DIAGRAM.md"
)

MISSING_FILES=()
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
        echo "❌ Missing: $file"
    else
        echo "✅ Found: $file"
    fi
done

if [ ${#MISSING_FILES[@]} -ne 0 ]; then
    echo "🚨 Missing required files. Please check the list above."
    exit 1
fi

# Check for placeholder values
echo "🔍 Checking for placeholder values..."
PLACEHOLDER_CHECKS=(
    "YOUR_PROJECT_ID:k8s/ai-shopping-deployment.yaml"
    "YOUR_PROJECT_ID:k8s/backend-deployment.yaml"
    "YOUR_PROJECT_ID:k8s/frontend-deployment.yaml"
    "<REGISTRY>:k8s/backend-deployment.yaml"
    "<REGISTRY>:k8s/frontend-deployment.yaml"
)

PLACEHOLDERS_FOUND=0
for check in "${PLACEHOLDER_CHECKS[@]}"; do
    placeholder="${check%%:*}"
    file="${check#*:}"
    if grep -q "$placeholder" "$file"; then
        echo "⚠️  Placeholder '$placeholder' found in $file"
        PLACEHOLDERS_FOUND=$((PLACEHOLDERS_FOUND + 1))
    fi
done

if [ $PLACEHOLDERS_FOUND -ne 0 ]; then
    echo "⚠️  Placeholders found. Remember to replace them before deployment."
else
    echo "✅ No placeholders found."
fi

# Check Dockerfile syntax
echo "🐳 Checking Dockerfiles..."
if command -v docker >/dev/null 2>&1; then
    echo "Testing backend Dockerfile syntax..."
    docker run --rm -v "$(pwd)/docker/backend.Dockerfile:/Dockerfile" hadolint/hadolint hadolint /Dockerfile
    echo "Testing frontend Dockerfile syntax..."
    docker run --rm -v "$(pwd)/docker/frontend.Dockerfile:/Dockerfile" hadolint/hadolint hadolint /Dockerfile
else
    echo "⚠️  Docker not found. Skipping Dockerfile syntax check."
fi

# Check Kubernetes manifests
echo "☸️  Checking Kubernetes manifests..."
if command -v kubectl >/dev/null 2>&1; then
    kubectl apply --dry-run=client -f k8s/ai-shopping-deployment.yaml >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ ai-shopping-deployment.yaml is valid"
    else
        echo "❌ ai-shopping-deployment.yaml has errors"
    fi
    
    kubectl apply --dry-run=client -f k8s/backend-deployment.yaml >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ backend-deployment.yaml is valid"
    else
        echo "❌ backend-deployment.yaml has errors"
    fi
    
    kubectl apply --dry-run=client -f k8s/frontend-deployment.yaml >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ frontend-deployment.yaml is valid"
    else
        echo "❌ frontend-deployment.yaml has errors"
    fi
    
    kubectl apply --dry-run=client -f k8s/backend-service.yaml >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ backend-service.yaml is valid"
    else
        echo "❌ backend-service.yaml has errors"
    fi
    
    kubectl apply --dry-run=client -f k8s/frontend-service.yaml >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ frontend-service.yaml is valid"
    else
        echo "❌ frontend-service.yaml has errors"
    fi
    
    kubectl apply --dry-run=client -f k8s/ingress.yaml >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ ingress.yaml is valid"
    else
        echo "❌ ingress.yaml has errors"
    fi
    
    kubectl apply --dry-run=client -f k8s/hpa.yaml >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ hpa.yaml is valid"
    else
        echo "❌ hpa.yaml has errors"
    fi
else
    echo "⚠️  kubectl not found. Skipping Kubernetes manifest validation."
fi

# Check documentation files
echo "📚 Checking documentation..."
if [ -f "HACKATHON_SUBMISSION.md" ]; then
    echo "✅ HACKATHON_SUBMISSION.md exists"
else
    echo "❌ HACKATHON_SUBMISSION.md missing"
fi

if [ -f "INTEGRATION_SUMMARY.md" ]; then
    echo "✅ INTEGRATION_SUMMARY.md exists"
else
    echo "❌ INTEGRATION_SUMMARY.md missing"
fi

if [ -f "README.md" ]; then
    echo "✅ README.md exists"
else
    echo "❌ README.md missing"
fi

echo "✅ Verification complete!"

if [ ${#MISSING_FILES[@]} -eq 0 ] && [ $PLACEHOLDERS_FOUND -eq 0 ]; then
    echo "🎉 All checks passed! Ready for GKE deployment."
elif [ ${#MISSING_FILES[@]} -eq 0 ]; then
    echo "⚠️  All files present but placeholders need to be replaced before deployment."
else
    echo "🚨 Missing files need to be created before deployment."
fi