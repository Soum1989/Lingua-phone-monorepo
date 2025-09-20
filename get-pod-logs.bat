@echo off
echo Getting frontend pod logs...
echo =============================
echo.

echo Getting cluster credentials...
gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a

echo.
echo Getting frontend pod logs...
kubectl logs lingua-frontend-578867dfc7-f57xf -n lingua-app > frontend-pod-logs.txt 2>&1

echo.
echo Getting all pod logs...
kubectl logs -n lingua-app --all-containers=true --prefix=true > all-pod-logs.txt 2>&1

echo.
echo Getting pod description...
kubectl describe pod lingua-frontend-578867dfc7-f57xf -n lingua-app > frontend-pod-description.txt 2>&1

echo.
echo Getting services information...
kubectl get services -n lingua-app > services.txt 2>&1

echo.
echo Log files have been saved:
echo - frontend-pod-logs.txt
echo - all-pod-logs.txt
echo - frontend-pod-description.txt
echo - services.txt
echo.
echo Please check these files for more information about the pod status.
pause