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
    print("Checking services in lingua-app namespace...")
    print("=" * 50)
    
    # Get cluster credentials
    print("1. Getting cluster credentials...")
    stdout, stderr, returncode = run_command("gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a")
    if returncode != 0:
        print("Failed to get cluster credentials.")
        sys.exit(1)
    
    # Get services
    print("\n2. Getting services...")
    stdout, stderr, returncode = run_command("kubectl get services -n lingua-app")
    if returncode != 0:
        print("Failed to get services.")
        print(f"Error: {stderr}")
        sys.exit(1)
    
    print("\nServices in lingua-app namespace:")
    print(stdout)
    
    # Get all resources
    print("\n3. Getting all resources...")
    stdout, stderr, returncode = run_command("kubectl get all -n lingua-app")
    if returncode != 0:
        print("Failed to get all resources.")
        print(f"Error: {stderr}")
        sys.exit(1)
    
    print("\nAll resources in lingua-app namespace:")
    print(stdout)

if __name__ == "__main__":
    main()