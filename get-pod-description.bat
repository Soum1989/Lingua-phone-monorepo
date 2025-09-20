@echo off
echo Getting pod description and saving to pod-description.txt...
kubectl describe pod lingua-frontend-578867dfc7-f57xf -n lingua-app > pod-description.txt 2>&1
echo Pod description saved to pod-description.txt
type pod-description.txt