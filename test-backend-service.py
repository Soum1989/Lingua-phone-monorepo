import requests
import json

def test_backend_service():
    # Test if we can access the backend service directly
    try:
        # Test the chat endpoint
        chat_data = {
            "message": "I am looking for a women's t-shirt",
            "language": "en"
        }

        print("Testing backend chat endpoint...")
        response = requests.post(
            "http://localhost:3002/api/chat",
            headers={"Content-Type": "application/json"},
            data=json.dumps(chat_data)
        )

        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")

        # Test the translation endpoint
        print("\nTesting backend translation endpoint...")
        translation_data = {
            "text": "Hello, how are you?",
            "targetLanguage": "es"
        }

        response = requests.post(
            "http://localhost:3002/api/translate",
            headers={"Content-Type": "application/json"},
            data=json.dumps(translation_data)
        )

        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")

    except Exception as e:
        print(f"Error testing backend service: {e}")

if __name__ == "__main__":
    test_backend_service()
