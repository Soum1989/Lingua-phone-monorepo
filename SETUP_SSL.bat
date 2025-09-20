@echo off
echo ========================================
echo Lingua Phone - SSL Setup for GKE
echo ========================================

echo.
echo 1. Applying Managed Certificate...
kubectl apply -f k8s/managed-certificate.yaml

echo.
echo 2. Applying updated Ingress configuration...
kubectl apply -f k8s/ingress.yaml

echo.
echo 3. Checking certificate status...
kubectl get managedcertificate -n lingua-app

echo.
echo Setup complete!
echo.
echo IMPORTANT: Remember to:
echo 1. Replace "your-domain.com" with your actual domain name in both files
echo 2. Point your domain's DNS to the ingress IP address
echo 3. Wait for the certificate to be provisioned (this can take several minutes)
echo.
echo You can check the certificate status with:
echo kubectl describe managedcertificate lingua-frontend-certificate -n lingua-app