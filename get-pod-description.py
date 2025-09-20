import subprocess
import sys

def run_command(command, output_file):
    print(f"Running: {command}")
    try:
        with open(output_file, 'w') as f:
            result = subprocess.run(command, shell=True, stdout=f, stderr=subprocess.STDOUT)
        print(f"Output saved to {output_file}")
        print(f"Return code: {result.returncode}")
    except Exception as e:
        print(f"Error running command: {e}")

def main():
    print("Getting pod description...")
    
    # Get pod description
    run_command("kubectl describe pod -l app=lingua-frontend -n lingua-app", "pod-description.txt")
    
    # Also get the current pod status
    run_command("kubectl get pods -n lingua-app", "pod-status.txt")
    
    print("\nDone! Check pod-description.txt and pod-status.txt for details.")

if __name__ == "__main__":
    main()