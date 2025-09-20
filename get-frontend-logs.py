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
    print("Getting frontend pod logs...")
    print("=" * 50)
    
    # Get cluster credentials
    print("1. Getting cluster credentials...")
    stdout, stderr, returncode = run_command("gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a")
    if returncode != 0:
        print("Failed to get cluster credentials.")
        sys.exit(1)
    
    # Get pod logs
    print("\n2. Getting frontend pod logs...")
    stdout, stderr, returncode = run_command("kubectl logs lingua-frontend-578867dfc7-f57xf -n lingua-app")
    if returncode != 0:
        print("Failed to get frontend pod logs.")
        print(f"Error: {stderr}")
        sys.exit(1)
    
    print("\nFrontend pod logs:")
    print(stdout)
    
    # Also get pod description
    print("\n3. Getting frontend pod description...")
    stdout, stderr, returncode = run_command("kubectl describe pod lingua-frontend-578867dfc7-f57xf -n lingua-app")
    if returncode != 0:
        print("Failed to get frontend pod description.")
        print(f"Error: {stderr}")
        sys.exit(1)
    
    print("\nFrontend pod description:")
    print(stdout)

if __name__ == "__main__":
    main()