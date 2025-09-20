@echo off
echo Testing services connectivity...
echo =============================

echo 1. Testing frontend service (http://localhost:8080)...
curl -v http://localhost:8080 > frontend-test.txt 2>&1
if %errorlevel% equ 0 (
    echo    Frontend service is accessible
) else (
    echo    Error accessing frontend service
)

echo 2. Testing backend service (http://localhost:3002)...
curl -v http://localhost:3002 > backend-test.txt 2>&1
if %errorlevel% equ 0 (
    echo    Backend service is accessible
) else (
    echo    Error accessing backend service
)

echo 3. Testing backend chat endpoint...
curl -X POST http://localhost:3002/api/chat -H "Content-Type: application/json" -d "{\"message\":\"I am looking for a women's t-shirt\",\"language\":\"en\"}" > chat-test.txt 2>&1
if %errorlevel% equ 0 (
    echo    Chat endpoint is accessible
) else (
    echo    Error accessing chat endpoint
)

echo.
echo Service testing completed. Check the output files for details:
echo - frontend-test.txt
echo - backend-test.txt
echo - chat-test.txt
echo.