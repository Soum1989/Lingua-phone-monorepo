import subprocess
import sys

def run_command(command):
    """Run a command and return the result"""
    print(f"Running: {command}")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(result.stdout)
        return result.returncode == 0
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        print(f"stderr: {e.stderr}")
        return False

def main():
    print("Deploying Lingua Phone application to GKE...")

    # Step 1: Check if namespace exists, create if not
    print("\n1. Checking if namespace lingua-app exists...")
    if not run_command("kubectl get namespace lingua-app"):
        print("   Creating namespace lingua-app...")
        if not run_command("kubectl create namespace lingua-app"):
            print("   Failed to create namespace")
            return 1
        else:
            print("   Namespace lingua-app created successfully")
    else:
        print("   Namespace lingua-app already exists")

    # Step 2: Create secret for Google Cloud credentials
    print("\n2. Creating secret for Google Cloud credentials...")
    if not run_command("kubectl create secret generic google-cloud-key --from-file=key.json=packages/backend/keys/service-account.json --namespace=lingua-app"):
        print("   Failed to create secret")
        return 1
    else:
        print("   Secret google-cloud-key created successfully")

    # Step 3: Build Docker images
    print("\n3. Building Docker images...")
    print("   Building backend image...")
    if not run_command("docker build -t lingua-backend:latest -f docker/backend.Dockerfile ."):
        print("   Failed to build backend image")
        return 1
    else:
        print("   Backend image built successfully")

    print("   Building frontend image...")
    if not run_command("docker build -t lingua-frontend:latest -f docker/frontend.Dockerfile ."):
        print("   Failed to build frontend image")
        return 1
    else:
        print("   Frontend image built successfully")

    # Step 4: Deploy application to GKE
    print("\n4. Deploying application to GKE...")
    if not run_command("kubectl apply -k k8s/"):
        print("   Failed to deploy application")
        return 1
    else:
        print("   Application deployed successfully")

    print("\nDeployment completed successfully!")
    print("You can check the status of your deployment with:")
    print("   kubectl get pods -n lingua-app")
    return 0

if __name__ == "__main__":
    sys.exit(main())
