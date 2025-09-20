@echo off
echo Getting frontend pod logs...
echo =========================
kubectl logs lingua-frontend-578867dfc7-f57xf -n lingua-app --previous > frontend-logs.txt 2>&1
echo Logs saved to frontend-logs.txt
echo.
echo Also getting current logs...
kubectl logs lingua-frontend-578867dfc7-f57xf -n lingua-app > frontend-logs-current.txt 2>&1
echo Current logs saved to frontend-logs-current.txt
echo.
echo Getting pod description...
kubectl describe pod lingua-frontend-578867dfc7-f57xf -n lingua-app > frontend-describe.txt 2>&1
echo Pod description saved to frontend-describe.txt
echo.
echo Done! Check the .txt files for details.
pause