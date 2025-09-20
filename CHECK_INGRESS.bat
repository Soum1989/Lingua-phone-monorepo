@echo off
echo ========================================
echo Lingua Phone - Ingress Status Check
echo ========================================

echo.
echo 1. Checking ingress status...
kubectl get ingress lingua-ingress -n lingua-app

echo.
echo 2. Describing ingress details...
kubectl describe ingress lingua-ingress -n lingua-app

echo.
echo 3. Checking managed certificate status...
kubectl get managedcertificate -n lingua-app

echo.
echo 4. Getting ingress IP address...
kubectl get ingress lingua-ingress -n lingua-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
echo.