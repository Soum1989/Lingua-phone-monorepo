import subprocess
import sys

def get_pod_logs():
    try:
        # Get the list of pods
        result = subprocess.run([
            'kubectl', 'get', 'pods', '-n', 'lingua-app', '-o', 'jsonpath={.items[*].metadata.name}'
        ], capture_output=True, text=True, check=True)

        pod_names = result.stdout.split()
        print("Pods in lingua-app namespace:")
        for pod_name in pod_names:
            print(f"  {pod_name}")

        # Get logs for frontend pod
        frontend_pods = [name for name in pod_names if 'frontend' in name]
        if frontend_pods:
            print(f"\nGetting logs for frontend pod: {frontend_pods[0]}")
            result = subprocess.run([
                'kubectl', 'logs', frontend_pods[0], '-n', 'lingua-app'
            ], capture_output=True, text=True)

            print("Frontend pod logs:")
            print(result.stdout)
            if result.stderr:
                print("Errors:")
                print(result.stderr)
        else:
            print("No frontend pods found")

    except subprocess.CalledProcessError as e:
        print(f"Error running kubectl command: {e}")
        print(f"Error output: {e.stderr}")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    get_pod_logs()
