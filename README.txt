Lingua Phone - Diagnostic Scripts README

This directory contains several diagnostic scripts to help troubleshoot the Lingua Phone application deployment on GKE:

1. application-status.bat
   - Basic status check of the cluster and application components
   - Shows cluster info, pods, services, deployments, and events

2. check-frontend-deployment.bat
   - Detailed check of the frontend deployment
   - Shows deployment details, pod status, and service information

3. check-backend-service.bat
   - Detailed check of the backend service
   - Shows deployment details, pod status, service information, and logs

4. comprehensive-status-check.bat
   - Complete diagnostic of the entire application
   - Shows all components, detailed information, and recent logs

To run any of these scripts:
1. Navigate to the Lingua-phone-monorepo directory
2. Double-click on the desired batch file, or
3. Run from command prompt: .\script-name.bat

These scripts will help identify issues with the deployment and provide information needed to troubleshoot the frontend pod crashes.