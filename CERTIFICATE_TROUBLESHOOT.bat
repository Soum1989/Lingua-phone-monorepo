@echo off
echo ========================================
echo Certificate Provisioning Troubleshooting
echo ========================================

echo.
echo Current time: %date% %time%
echo.
echo 1. Checking certificate status...
kubectl get managedcertificate lingua-frontend-certificate -n lingua-app

echo.
echo 2. Detailed certificate information...
kubectl describe managedcertificate lingua-frontend-certificate -n lingua-app

echo.
echo 3. Checking ingress status...
kubectl get ingress lingua-ingress -n lingua-app

echo.
echo 4. Checking ingress details...
kubectl describe ingress lingua-ingress -n lingua-app

echo.
echo 5. Testing DNS resolution from multiple sources...
echo Testing local DNS...
nslookup lingua-phone.gketurns10.com 2>&1 | findstr "Address\|Name\|timed out"

echo.
echo Testing Google DNS...
nslookup lingua-phone.gketurns10.com 8.8.8.8 2>&1 | findstr "Address\|Name\|timed out"

echo.
echo Testing Cloudflare DNS...
nslookup lingua-phone.gketurns10.com 1.1.1.1 2>&1 | findstr "Address\|Name\|timed out"

echo.
echo 6. Checking service status...
kubectl get svc -n lingua-app

echo.
echo Troubleshooting steps:
echo ===================
echo 1. If DNS resolves correctly but certificate shows "FailedNotVisible":
echo    - Wait 15-30 minutes for DNS propagation
echo    - Google's certificate authority may need time to verify globally
echo.
echo 2. If DNS does not resolve:
echo    - Check your DNS provider settings
echo    - Ensure A record points to 34.45.239.154
echo    - Check TTL settings (lower is faster)
echo.
echo 3. If ingress shows errors:
echo    - Check ingress configuration
echo    - Ensure TLS section is properly defined
echo.
echo The certificate provisioning process is automated and should complete
echo once DNS propagation is finished and Google can verify domain ownership.