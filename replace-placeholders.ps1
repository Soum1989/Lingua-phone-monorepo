# PowerShell script to replace placeholder values in Kubernetes manifests
# Usage: .\replace-placeholders.ps1 -ProjectId "your-project-id" -Registry "your-registry"

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,
    
    [Parameter(Mandatory=$false)]
    [string]$Registry = "gcr.io"
)

Write-Host "Replacing placeholders in Kubernetes manifests..." -ForegroundColor Green

# Files to process
$Files = @(
    "k8s\ai-shopping-deployment.yaml"
    "k8s\backend-deployment.yaml"
    "k8s\frontend-deployment.yaml"
)

# Replace placeholders
foreach ($file in $Files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $updatedContent = $content -replace "YOUR_PROJECT_ID", $ProjectId
        $updatedContent = $updatedContent -replace "gcr.io/YOUR_PROJECT_ID", "$Registry/$ProjectId"
        Set-Content $file $updatedContent
        Write-Host "✅ Updated $file" -ForegroundColor Green
    } else {
        Write-Host "❌ File not found: $file" -ForegroundColor Red
    }
}

Write-Host "✅ Placeholder replacement complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Install Google Cloud SDK if not already installed" -ForegroundColor Cyan
Write-Host "2. Run: gcloud auth login" -ForegroundColor Cyan
Write-Host "3. Run: gcloud config set project $ProjectId" -ForegroundColor Cyan