# GKE Deployment Verification Script for PowerShell

Write-Host "🔍 Verifying GKE Deployment Readiness..." -ForegroundColor Green

# Check if required files exist
Write-Host "📁 Checking required files..." -ForegroundColor Yellow
$RequiredFiles = @(
    "k8s\ai-shopping-deployment.yaml"
    "k8s\backend-deployment.yaml"
    "k8s\frontend-deployment.yaml"
    "k8s\backend-service.yaml"
    "k8s\frontend-service.yaml"
    "k8s\ingress.yaml"
    "k8s\hpa.yaml"
    "docker\backend.Dockerfile"
    "docker\frontend.Dockerfile"
    "GKE_DEPLOYMENT_GUIDE.md"
    "GKE_DEPLOYMENT_CHECKLIST.md"
    "ARCHITECTURE_DIAGRAM.md"
)

$MissingFiles = @()
foreach ($file in $RequiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ Found: $file" -ForegroundColor Green
    } else {
        $MissingFiles += $file
        Write-Host "❌ Missing: $file" -ForegroundColor Red
    }
}

if ($MissingFiles.Count -ne 0) {
    Write-Host "🚨 Missing required files. Please check the list above." -ForegroundColor Red
    exit 1
}

# Check for placeholder values
Write-Host "🔍 Checking for placeholder values..." -ForegroundColor Yellow
$PlaceholderChecks = @(
    @{Placeholder = "YOUR_PROJECT_ID"; File = "k8s\ai-shopping-deployment.yaml"}
    @{Placeholder = "YOUR_PROJECT_ID"; File = "k8s\backend-deployment.yaml"}
    @{Placeholder = "YOUR_PROJECT_ID"; File = "k8s\frontend-deployment.yaml"}
    @{Placeholder = "gcr.io/YOUR_PROJECT_ID"; File = "k8s\ai-shopping-deployment.yaml"}
    @{Placeholder = "gcr.io/YOUR_PROJECT_ID"; File = "k8s\backend-deployment.yaml"}
    @{Placeholder = "gcr.io/YOUR_PROJECT_ID"; File = "k8s\frontend-deployment.yaml"}
)

$PlaceholdersFound = 0
foreach ($check in $PlaceholderChecks) {
    $content = Get-Content $check.File -Raw
    if ($content -match $check.Placeholder) {
        Write-Host "⚠️  Placeholder '$($check.Placeholder)' found in $($check.File)" -ForegroundColor Yellow
        $PlaceholdersFound++
    }
}

if ($PlaceholdersFound -ne 0) {
    Write-Host "⚠️  Placeholders found. Remember to replace them before deployment." -ForegroundColor Yellow
} else
    Write-Host "✅ No placeholders found." -ForegroundColor Green
}

# Check Dockerfile syntax (if docker is available)
Write-Host "🐳 Checking Dockerfiles..." -ForegroundColor Yellow
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "Testing backend Dockerfile syntax..." -ForegroundColor Cyan
    docker run --rm -v "${PWD}/docker/backend.Dockerfile:/Dockerfile" hadolint/hadolint hadolint /Dockerfile
    
    Write-Host "Testing frontend Dockerfile syntax..." -ForegroundColor Cyan
    docker run --rm -v "${PWD}/docker/frontend.Dockerfile:/Dockerfile" hadolint/hadolint hadolint /Dockerfile
} else {
    Write-Host "⚠️  Docker not found. Skipping Dockerfile syntax check." -ForegroundColor Yellow
}

# Check Kubernetes manifests (if kubectl is available)
Write-Host "☸️  Checking Kubernetes manifests..." -ForegroundColor Yellow
if (Get-Command kubectl -ErrorAction SilentlyContinue) {
    $Manifests = @(
        "k8s\ai-shopping-deployment.yaml"
        "k8s\backend-deployment.yaml"
        "k8s\frontend-deployment.yaml"
        "k8s\backend-service.yaml"
        "k8s\frontend-service.yaml"
        "k8s\ingress.yaml"
        "k8s\hpa.yaml"
    )
    
    foreach ($manifest in $Manifests) {
        $result = kubectl apply --dry-run=client -f $manifest 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $manifest is valid" -ForegroundColor Green
        } else {
            Write-Host "❌ $manifest has errors" -ForegroundColor Red
        }
    }
} else {
    Write-Host "⚠️  kubectl not found. Skipping Kubernetes manifest validation." -ForegroundColor Yellow
}

# Check documentation files
Write-Host "📚 Checking documentation..." -ForegroundColor Yellow
if (Test-Path "HACKATHON_SUBMISSION.md") {
    Write-Host "✅ HACKATHON_SUBMISSION.md exists" -ForegroundColor Green
} else {
    Write-Host "❌ HACKATHON_SUBMISSION.md missing" -ForegroundColor Red
}

if (Test-Path "INTEGRATION_SUMMARY.md") {
    Write-Host "✅ INTEGRATION_SUMMARY.md exists" -ForegroundColor Green
} else {
    Write-Host "❌ INTEGRATION_SUMMARY.md missing" -ForegroundColor Red
}

if (Test-Path "README.md") {
    Write-Host "✅ README.md exists" -ForegroundColor Green
} else {
    Write-Host "❌ README.md missing" -ForegroundColor Red
}

Write-Host "✅ Verification complete!" -ForegroundColor Green

if ($MissingFiles.Count -eq 0 -and $PlaceholdersFound -eq 0) {
    Write-Host "🎉 All checks passed! Ready for GKE deployment." -ForegroundColor Green
} elseif ($MissingFiles.Count -eq 0) {
    Write-Host "⚠️  All files present but placeholders need to be replaced before deployment." -ForegroundColor Yellow
} else {
    Write-Host "🚨 Missing files need to be created before deployment." -ForegroundColor Red
}