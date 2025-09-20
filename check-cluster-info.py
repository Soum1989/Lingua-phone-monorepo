import subprocess
import json

def run_kubectl_command(command):
    """Run a kubectl command and return the output"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            return result.stdout
        else:
            return f"Error: {result.stderr}"
    except Exception as e:
        return f"Exception: {str(e)}"

def main():
    print("Checking Kubernetes cluster information...")
    print("=" * 50)

    # Get pod information
    print("1. Pod Information:")
    pod_info = run_kubectl_command("kubectl get pods -n lingua-app -o wide")
    print(pod_info)
    print()

    # Get pod description
    print("2. Frontend Pod Description:")
    pod_description = run_kubectl_command("kubectl describe pod lingua-frontend-578867dfc7-f57xf -n lingua-app")
    print(pod_description)
    print()

    # Get pod logs
    print("3. Frontend Pod Logs:")
    pod_logs = run_kubectl_command("kubectl logs lingua-frontend-578867dfc7-f57xf -n lingua-app")
    print(pod_logs)
    print()

    # Get service information
    print("4. Service Information:")
    service_info = run_kubectl_command("kubectl get services -n lingua-app")
    print(service_info)
    print()

    # Get events
    print("5. Events:")
    events = run_kubectl_command("kubectl get events -n lingua-app")
    print(events)

if __name__ == "__main__":
    main()
