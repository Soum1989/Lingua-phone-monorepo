@echo off
echo ========================================
echo Domain Access Test
echo ========================================

echo.
echo 1. Testing DNS resolution...
nslookup lingua-phone.gketurns10.com

echo.
echo 2. Testing direct IP access...
powershell -Command "Invoke-WebRequest -Uri http://34.45.239.154 -TimeoutSec 10 -ErrorAction SilentlyContinue | Select-Object StatusCode, StatusDescription"

echo.
echo 3. Testing ingress IP access...
powershell -Command "Invoke-WebRequest -Uri http://34.54.239.230 -TimeoutSec 10 -ErrorAction SilentlyContinue | Select-Object StatusCode, StatusDescription"

echo.
echo 4. Testing domain access through ingress...
powershell -Command "Invoke-WebRequest -Uri http://lingua-phone.gketurns10.com -TimeoutSec 10 -ErrorAction SilentlyContinue | Select-Object StatusCode, StatusDescription"

echo.
echo Test complete.