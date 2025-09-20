@echo off
setlocal

echo Testing translation endpoints...

REM Test 1: Basic translation
echo.
echo === Test 1: Bengali to English translation ===
curl -X POST http://localhost:3002/api/translate ^
  -H "Content-Type: application/json" ^
  -d "{\"text\":\"মেয়েদের জন্য টি-শার্ট\",\"from\":\"bn\",\"to\":\"en\"}"

REM Test 2: English to Bengali translation
echo.
echo === Test 2: English to Bengali translation ===
curl -X POST http://localhost:3002/api/translate ^
  -H "Content-Type: application/json" ^
  -d "{\"text\":\"T-shirt for girls\",\"from\":\"en\",\"to\":\"bn\"}"

REM Test 3: Hindi to English translation
echo.
echo === Test 3: Hindi to English translation ===
curl -X POST http://localhost:3002/api/translate ^
  -H "Content-Type: application/json" ^
  -d "{\"text\":\"महिलाओं के लिए टी-शर्ट\",\"from\":\"hi\",\"to\":\"en\"}"

REM Test 4: Built-in test endpoint
echo.
echo === Test 4: Built-in test endpoint ===
curl -X GET http://localhost:3002/api/test-translation

REM Test 5: Supported languages
echo.
echo === Test 5: Supported languages ===
curl -X GET http://localhost:3002/api/languages

echo.
echo All tests completed.
pause