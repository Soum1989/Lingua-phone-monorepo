import subprocess
import time

def check_frontend_status():
    try:
        # Get pod status
        result = subprocess.run([
            "kubectl", "get", "pods", "-n", "lingua-app", "-l", "app=lingua-frontend", "-o", "jsonpath={.items[*].status.phase}"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            status = result.stdout.strip()
            print(f"Frontend pod status: {status}")
            
            if status == "Running":
                print("✅ Frontend is running successfully!")
                return True
            elif status == "CrashLoopBackOff":
                print("❌ Frontend is still crashing!")
                return False
            else:
                print(f"⚠️  Frontend is in {status} state")
                return False
        else:
            print(f"Error getting pod status: {result.stderr}")
            return False
    except Exception as e:
        print(f"Error checking frontend status: {e}")
        return False

def main():
    print("Checking frontend pod status...")
    print("=" * 40)
    
    # Check status
    is_running = check_frontend_status()
    
    if not is_running:
        print("\nChecking pod details...")
        print("-" * 40)
        # Get detailed pod information
        try:
            result = subprocess.run([
                "kubectl", "describe", "pod", "-n", "lingua-app", "-l", "app=lingua-frontend"
            ], capture_output=True, text=True)
            
            if result.returncode == 0:
                # Extract just the last 20 lines for brevity
                lines = result.stdout.split('\n')
                print("\n".join(lines[-20:]))
            else:
                print(f"Error getting pod details: {result.stderr}")
        except Exception as e:
            print(f"Error getting pod details: {e}")

if __name__ == "__main__":
    main()