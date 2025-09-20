import subprocess
import sys

def run_command(command):
    """Run a command and return the output"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        return result.stdout, result.stderr, result.returncode
    except Exception as e:
        return "", str(e), 1

def main():
    print("Checking pod status in lingua-app namespace...")
    print("=" * 50)
    
    # Get pods in lingua-app namespace
    stdout, stderr, returncode = run_command("kubectl get pods -n lingua-app")
    
    if returncode == 0:
        print("Pods in lingua-app namespace:")
        print(stdout)
    else:
        print("Error getting pod status:")
        print(stderr)
        print("Return code:", returncode)
    
    print("\n" + "=" * 50)
    
    # Get services in lingua-app namespace
    stdout, stderr, returncode = run_command("kubectl get services -n lingua-app")
    
    if returncode == 0:
        print("Services in lingua-app namespace:")
        print(stdout)
    else:
        print("Error getting service status:")
        print(stderr)
        print("Return code:", returncode)

if __name__ == "__main__":
    main()