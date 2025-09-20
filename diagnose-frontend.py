import subprocess
import sys

def run_command(command):
    print(f"Running: {command}")
    print("-" * 50)
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        print("STDOUT:")
        print(result.stdout)
        if result.stderr:
            print("STDERR:")
            print(result.stderr)
        print(f"Return code: {result.returncode}")
    except Exception as e:
        print(f"Error running command: {e}")
    print("\n" + "=" * 50 + "\n")

def main():
    print("========================================")
    print("Lingua Phone - Frontend Crash Diagnosis")
    print("========================================\n")
    
    # 1. Get cluster credentials
    print("1. Getting cluster credentials...")
    run_command("gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a")
    
    # 2. Check pod status
    print("2. Checking current pod status...")
    run_command("kubectl get pods -n lingua-app")
    
    # 3. Get detailed pod information
    print("3. Getting detailed pod information...")
    run_command("kubectl describe pod -l app=lingua-frontend -n lingua-app")
    
    # 4. Check current pod logs
    print("4. Checking pod logs (current)...")
    run_command("kubectl logs -l app=lingua-frontend -n lingua-app --tail=50")
    
    # 5. Check previous pod logs
    print("5. Checking pod logs (previous)...")
    run_command("kubectl logs -l app=lingua-frontend -n lingua-app --previous --tail=50")
    
    # 6. Check Kubernetes events
    print("6. Checking Kubernetes events...")
    run_command("kubectl get events -n lingua-app --sort-by=.lastTimestamp")
    
    # 7. Check service configuration
    print("7. Checking service configuration...")
    run_command("kubectl get service lingua-frontend-service -n lingua-app -o wide")
    
    # 8. Check backend service for comparison
    print("8. Checking backend service (for comparison)...")
    run_command("kubectl get service lingua-backend-service -n lingua-app -o wide")
    
    print("========================================")
    print("Diagnosis Complete")
    print("========================================")
    print("\nPlease review the output above to identify the cause of the frontend crash.")
    print("\nCommon causes:")
    print("1. Nginx configuration errors")
    print("2. Missing files in the Docker image")
    print("3. Port binding issues")
    print("4. Resource constraints")
    print("5. Image not found or corrupted")

if __name__ == "__main__":
    main()