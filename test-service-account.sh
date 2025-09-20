#!/bin/bash
# Quick test to verify if service account JSON is properly formatted

echo "🔍 Testing Google Cloud Service Account Setup..."

# Check if the file exists
if [ -f "packages/backend/keys/service-account.json" ]; then
    echo "✅ service-account.json file found"
    
    # Test if it's valid JSON
    if node -e "JSON.parse(require('fs').readFileSync('packages/backend/keys/service-account.json', 'utf8'))" 2>/dev/null; then
        echo "✅ Valid JSON format"
        
        # Check for required fields
        node -e "
            const data = JSON.parse(require('fs').readFileSync('packages/backend/keys/service-account.json', 'utf8'));
            console.log(data.type === 'service_account' ? '✅ Valid service account type' : '❌ Invalid type');
            console.log(data.project_id ? '✅ Project ID found: ' + data.project_id : '❌ No project ID');
            console.log(data.client_email ? '✅ Client email found: ' + data.client_email : '❌ No client email');
            console.log(data.private_key ? '✅ Private key found' : '❌ No private key');
        "
    else
        echo "❌ Invalid JSON format"
    fi
else
    echo "❌ service-account.json file not found"
    echo "💡 Please place your complete JSON file at: packages/backend/keys/service-account.json"
fi

echo "
📋 Next steps:
1. Save your complete JSON service account file
2. Run: npm run dev
3. Test: node test-translation.js
"