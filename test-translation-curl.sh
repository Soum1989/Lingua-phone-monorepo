#!/bin/bash

# Simple script to test translation endpoints with curl

echo "Testing translation endpoints..."

# Test 1: Basic translation
echo -e "\n=== Test 1: Bengali to English translation ==="
curl -X POST http://localhost:3002/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "মেয়েদের জন্য টি-শার্ট",
    "from": "bn",
    "to": "en"
  }'

# Test 2: English to Bengali translation
echo -e "\n=== Test 2: English to Bengali translation ==="
curl -X POST http://localhost:3002/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "T-shirt for girls",
    "from": "en",
    "to": "bn"
  }'

# Test 3: Hindi to English translation
echo -e "\n=== Test 3: Hindi to English translation ==="
curl -X POST http://localhost:3002/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "महिलाओं के लिए टी-शर्ट",
    "from": "hi",
    "to": "en"
  }'

# Test 4: Built-in test endpoint
echo -e "\n=== Test 4: Built-in test endpoint ==="
curl -X GET http://localhost:3002/api/test-translation

# Test 5: Supported languages
echo -e "\n=== Test 5: Supported languages ==="
curl -X GET http://localhost:3002/api/languages

echo -e "\n\nAll tests completed."