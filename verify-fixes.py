import os
import sys

def check_file_content(file_path, expected_content):
    """Check if a file contains expected content"""
    try:
        with open(file_path, 'r') as f:
            content = f.read()
            if expected_content in content:
                print(f"✓ {file_path} contains expected content")
                return True
            else:
                print(f"✗ {file_path} does not contain expected content")
                print(f"  Expected: {expected_content}")
                return False
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return False

def main():
    print("Verifying fixes applied to resolve frontend pod crash...")
    print("=" * 60)
    
    # Check backend service name in backend-service.yaml
    backend_service_file = "k8s/backend-service.yaml"
    expected_service_name = "lingua-backend-service"
    check_file_content(backend_service_file, expected_service_name)
    
    # Check nginx configuration in ConfigMap
    configmap_file = "k8s/configmap.yaml"
    expected_nginx_config = "server lingua-backend-service:3002;"
    check_file_content(configmap_file, expected_nginx_config)
    
    # Check nginx configuration in nginx-k8s.conf
    nginx_conf_file = "docker/nginx-k8s.conf"
    check_file_content(nginx_conf_file, expected_nginx_config)
    
    # Check frontend Dockerfile
    frontend_dockerfile = "docker/frontend-k8s.Dockerfile"
    if os.path.exists(frontend_dockerfile):
        print(f"✓ {frontend_dockerfile} exists")
    else:
        print(f"✗ {frontend_dockerfile} does not exist")
    
    # Check redeployment scripts
    redeploy_script = "fix-and-redeploy.py"
    if os.path.exists(redeploy_script):
        print(f"✓ {redeploy_script} exists")
    else:
        print(f"✗ {redeploy_script} does not exist")
    
    redeploy_bat = "fix-and-redeploy.bat"
    if os.path.exists(redeploy_bat):
        print(f"✓ {redeploy_bat} exists")
    else:
        print(f"✗ {redeploy_bat} does not exist")
    
    print("\n" + "=" * 60)
    print("Verification complete. All fixes should be in place.")
    print("Next steps:")
    print("1. Run 'fix-and-redeploy.bat' to apply the fixes")
    print("2. Check pod status with 'kubectl get pods -n lingua-app'")

if __name__ == "__main__":
    main()