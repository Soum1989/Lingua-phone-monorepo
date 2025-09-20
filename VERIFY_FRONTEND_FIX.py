import subprocess
import time
import json

def run_command(command):
    """Run a command and return the result"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        return result.returncode, result.stdout, result.stderr
    except Exception as e:
        return -1, "", str(e)

def check_pod_status():
    """Check the status of the frontend pod"""
    code, stdout, stderr = run_command("kubectl get pods -n lingua-app -l app=lingua-frontend -o json")
    
    if code != 0:
        print(f"Error getting pod status: {stderr}")
        return None
    
    try:
        pod_info = json.loads(stdout)
        if pod_info.get("items"):
            return pod_info["items"][0]
        return None
    except json.JSONDecodeError:
        print("Error parsing pod information")
        return None

def get_pod_logs(pod_name):
    """Get logs from the pod"""
    code, stdout, stderr = run_command(f"kubectl logs {pod_name} -n lingua-app")
    if code == 0:
        return stdout
    return stderr

def main():
    print("=" * 50)
    print("Lingua Phone Frontend Fix Verification")
    print("=" * 50)
    print()
    
    # Get cluster credentials
    print("1. Getting cluster credentials...")
    code, stdout, stderr = run_command("gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a")
    if code != 0:
        print(f"   Warning: Could not get cluster credentials: {stderr}")
    else:
        print("   ✓ Cluster credentials obtained")
    
    print()
    print("2. Checking frontend pod status...")
    pod = check_pod_status()
    
    if not pod:
        print("   ✗ Could not get pod information")
        return
    
    pod_name = pod["metadata"]["name"]
    pod_status = pod["status"]["phase"]
    container_statuses = pod["status"].get("containerStatuses", [])
    
    print(f"   Pod Name: {pod_name}")
    print(f"   Status: {pod_status}")
    
    # Check container status in detail
    if container_statuses:
        container_state = container_statuses[0].get("state", {})
        if "running" in container_state:
            print("   ✓ Container is running")
        elif "waiting" in container_state:
            reason = container_state["waiting"].get("reason", "Unknown")
            message = container_state["waiting"].get("message", "")
            print(f"   ⚠ Container is waiting: {reason}")
            if message:
                print(f"     Message: {message}")
        elif "terminated" in container_state:
            reason = container_state["terminated"].get("reason", "Unknown")
            print(f"   ✗ Container is terminated: {reason}")
    
    # Check restart count
    restart_count = container_statuses[0].get("restartCount", 0) if container_statuses else 0
    print(f"   Restart Count: {restart_count}")
    
    if restart_count > 10:
        print("   ⚠ High restart count - pod may be unstable")
    
    print()
    print("3. Checking services...")
    code, stdout, stderr = run_command("kubectl get services -n lingua-app")
    if code == 0:
        print("   Services:")
        print(stdout)
    else:
        print(f"   Error getting services: {stderr}")
    
    print()
    print("4. Summary:")
    print("-" * 30)
    
    if pod_status == "Running":
        print("✅ SUCCESS: Frontend pod is running!")
        print("   Your application should now be accessible at http://34.45.239.154")
    elif pod_status == "Pending":
        print("⚠ WARNING: Frontend pod is pending")
        print("   This may be temporary while the pod is starting")
    elif pod_status in ["Failed", "Unknown"]:
        print("❌ ERROR: Frontend pod is in an error state")
        print("   Please check the detailed diagnostics")
    else:
        print(f"ℹ INFO: Frontend pod is in {pod_status} state")
        print("   This may be a transitional state")
    
    print()
    print("Next steps:")
    print("1. Wait a few minutes and run this script again")
    print("2. If issues persist, run: diagnose-frontend-crash.bat")
    print("3. Check your application at: http://34.45.239.154")

if __name__ == "__main__":
    main()