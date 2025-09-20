import subprocess
import sys

def run_command(command):
    """Run a command and return the output"""
    try:
        print(f"Running command: {command}")
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        print(f"STDOUT: {result.stdout}")
        if result.stderr:
            print(f"STDERR: {result.stderr}")
        print(f"Return code: {result.returncode}")
        return result.stdout, result.stderr, result.returncode
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return "", str(e), 1

def main():
    print("Rebuilding and redeploying application to GKE cluster...")
    print("=" * 50)
    
    # Get cluster credentials
    print("1. Getting cluster credentials...")
    stdout, stderr, returncode = run_command("gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a")
    if returncode != 0:
        print("Failed to get cluster credentials.")
        sys.exit(1)
    
    # Build and push Docker images
    print("\n2. Building and pushing Docker images...")
    
    print("Building backend image...")
    stdout, stderr, returncode = run_command("docker build -t gcr.io/lingua-phone/lingua-backend:latest -f docker/backend.Dockerfile .")
    if returncode != 0:
        print("Failed to build backend image.")
        sys.exit(1)
    
    print("Building frontend image with Kubernetes-specific configuration...")
    stdout, stderr, returncode = run_command("docker build -t gcr.io/lingua-phone/lingua-frontend:latest -f docker/frontend-k8s.Dockerfile .")
    if returncode != 0:
        print("Failed to build frontend image.")
        sys.exit(1)
    
    print("Pushing backend image...")
    stdout, stderr, returncode = run_command("docker push gcr.io/lingua-phone/lingua-backend:latest")
    if returncode != 0:
        print("Failed to push backend image.")
        sys.exit(1)
    
    print("Pushing frontend image...")
    stdout, stderr, returncode = run_command("docker push gcr.io/lingua-phone/lingua-frontend:latest")
    if returncode != 0:
        print("Failed to push frontend image.")
        sys.exit(1)
    
    # Delete existing pods to force recreation with new images
    print("\n3. Deleting existing pods to force recreation with new images...")
    stdout, stderr, returncode = run_command("kubectl delete pods -n lingua-app --all")
    if returncode != 0:
        print("Failed to delete existing pods.")
        sys.exit(1)
    
    # Wait a moment for pods to be deleted
    print("Waiting for pods to be deleted...")
    stdout, stderr, returncode = run_command("timeout /t 30 /nobreak")
    
    # Check pod status
    print("\n4. Checking pod status...")
    stdout, stderr, returncode = run_command("kubectl get pods -n lingua-app")
    if returncode == 0:
        print("Pods in lingua-app namespace:")
        print(stdout)
    else:
        print("Error getting pod status:")
        print(stderr)
    
    print("\nRebuild and redeployment initiated! Please check the pod status to verify the fix.")

if __name__ == "__main__":
    main()