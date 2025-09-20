# PowerShell script to run the complete GKE deployment
Write-Host "Starting complete GKE deployment..." -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Run the deployment batch file
& .\complete-gke-deployment.bat

Write-Host "Deployment script completed." -ForegroundColor Green