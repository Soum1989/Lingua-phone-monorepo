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
    print("Checking deployment status...")
    print("=" * 50)
    
    # Get cluster credentials
    print("1. Getting cluster credentials...")
    stdout, stderr, returncode = run_command("gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a")
    if returncode != 0:
        print("Failed to get cluster credentials.")
        sys.exit(1)
    
    # Check pod status
    print("\n2. Checking pod status...")
    stdout, stderr, returncode = run_command("kubectl get pods -n lingua-app")
    if returncode == 0:
        print("Pods in lingua-app namespace:")
        print(stdout)
    else:
        print("Error getting pod status:")
        print(stderr)
    
    # Check services
    print("\n3. Checking services...")
    stdout, stderr, returncode = run_command("kubectl get services -n lingua-app")
    if returncode == 0:
        print("Services in lingua-app namespace:")
        print(stdout)
    else:
        print("Error getting services:")
        print(stderr)

if __name__ == "__main__":
    main()