@echo off
echo Checking cluster status and saving to cluster-status.txt...
echo ==========================================

echo 1. Checking Google Cloud authentication...
gcloud auth list > cluster-status.txt 2>&1
echo. >> cluster-status.txt

echo 2. Listing clusters...
gcloud container clusters list >> cluster-status.txt 2>&1
echo. >> cluster-status.txt

echo 3. Getting cluster credentials...
gcloud container clusters get-credentials lingua-cluster --zone=us-central1-a >> cluster-status.txt 2>&1
echo. >> cluster-status.txt

echo 4. Checking nodes...
kubectl get nodes >> cluster-status.txt 2>&1
echo. >> cluster-status.txt

echo 5. Checking pod status...
kubectl get pods -n lingua-app >> cluster-status.txt 2>&1
echo. >> cluster-status.txt

echo Cluster status check completed. Results saved to cluster-status.txt
type cluster-status.txt