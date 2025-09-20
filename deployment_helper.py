#!/usr/bin/env python3
"""
Deployment helper script for Lingua Phone application
This script helps check the status of your GKE deployment
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and return the result"""
    print(f"\n{description}")
    print(f"Running: {command}")
    print("-" * 50)
    
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print("SUCCESS:")
            print(result.stdout)
        else:
            print("ERROR:")
            print(result.stderr)
        return result.returncode == 0
    except Exception as e:
        print(f"Exception occurred: {e}")
        return False

def check_deployment_status():
    """Check the current deployment status"""
    print("=" * 60)
    print("Lingua Phone - Deployment Status Checker")
    print("=" * 60)
    
    # Check if we're in the right directory
    if not os.path.exists("docker") or not os.path.exists("k8s"):
        print("ERROR: Please run this script from the Lingua-phone-monorepo directory")
        return
    
    # Check Google Cloud authentication
    if not run_command("gcloud auth list", "Checking Google Cloud authentication"):
        print("Please authenticate with: gcloud auth login")
        return
    
    # Get cluster credentials
    run_command("gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a", 
                "Getting cluster credentials")
    
    # Check pod status
    run_command("kubectl get pods -n lingua-app", "Checking pod status")
    
    # Check service status
    run_command("kubectl get services -n lingua-app", "Checking service status")
    
    print("\n" + "=" * 60)
    print("Status check completed!")
    print("=" * 60)

def deploy_application():
    """Deploy the application using the Miniconda version"""
    print("=" * 60)
    print("Lingua Phone - Deployment Script (Miniconda Version)")
    print("=" * 60)
    
    # Check if we're in the right directory
    if not os.path.exists("docker") or not os.path.exists("k8s"):
        print("ERROR: Please run this script from the Lingua-phone-monorepo directory")
        return
    
    # Run the Miniconda deployment batch file
    run_command("complete-deployment-miniconda.bat", "Running Miniconda deployment script")

if __name__ == "__main__":
    print("Lingua Phone Deployment Helper")
    print("1. Check deployment status")
    print("2. Deploy application (using Miniconda)")
    
    choice = input("\nEnter your choice (1 or 2): ").strip()
    
    if choice == "1":
        check_deployment_status()
    elif choice == "2":
        deploy_application()
    else:
        print("Invalid choice. Please run the script again and select 1 or 2.")