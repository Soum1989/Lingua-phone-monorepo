import requests
import json
import time

def test_connectivity():
    results = []

    # Test frontend service
    results.append("1. Testing frontend service (http://localhost:8080)...")
    try:
        response = requests.get("http://localhost:8080", timeout=5)
        results.append(f"   Frontend status code: {response.status_code}")
        results.append(f"   Frontend response headers: {dict(response.headers)}")
    except requests.exceptions.RequestException as e:
        results.append(f"   Error accessing frontend: {e}")

    # Test backend service
    results.append("\n2. Testing backend service (http://localhost:3002)...")
    try:
        response = requests.get("http://localhost:3002", timeout=5)
        results.append(f"   Backend status code: {response.status_code}")
        results.append(f"   Backend response headers: {dict(response.headers)}")
    except requests.exceptions.RequestException as e:
        results.append(f"   Error accessing backend: {e}")

    # Test backend chat endpoint
    results.append("\n3. Testing backend chat endpoint...")
    try:
        chat_data = {
            "message": "I am looking for a women's t-shirt",
            "language": "en"
        }
        response = requests.post(
            "http://localhost:3002/api/chat",
            json=chat_data,
            timeout=10
        )
        results.append(f"   Chat endpoint status code: {response.status_code}")
        results.append(f"   Chat endpoint response: {response.text}")
    except requests.exceptions.RequestException as e:
        results.append(f"   Error accessing chat endpoint: {e}")

    # Save results to file
    with open("connectivity-test-results.txt", "w") as f:
        for result in results:
            f.write(result + "\n")
            print(result)

    print("\nConnectivity testing completed. Results saved to connectivity-test-results.txt")

if __name__ == "__main__":
    test_connectivity()
