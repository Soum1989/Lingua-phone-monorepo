import requests
import time

def test_services():
    print("Testing services connectivity...")

    # Test frontend service
    print("\n1. Testing frontend service (http://localhost:8080)...")
    try:
        response = requests.get("http://localhost:8080", timeout=5)
        print(f"   Frontend status code: {response.status_code}")
        print(f"   Frontend response headers: {dict(response.headers)}")
    except requests.exceptions.RequestException as e:
        print(f"   Error accessing frontend: {e}")

    # Test backend service
    print("\n2. Testing backend service (http://localhost:3002)...")
    try:
        response = requests.get("http://localhost:3002", timeout=5)
        print(f"   Backend status code: {response.status_code}")
        print(f"   Backend response headers: {dict(response.headers)}")
    except requests.exceptions.RequestException as e:
        print(f"   Error accessing backend: {e}")

    # Test backend chat endpoint
    print("\n3. Testing backend chat endpoint...")
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
        print(f"   Chat endpoint status code: {response.status_code}")
        print(f"   Chat endpoint response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"   Error accessing chat endpoint: {e}")

    print("\nService testing completed.")

if __name__ == "__main__":
    test_services()
