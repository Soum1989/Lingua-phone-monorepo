@echo off
color 0A
title Lingua Phone - Debug Frontend Issues

echo ========================================
echo Lingua Phone - Debug Frontend Issues
echo ========================================
echo.

echo 1. Describing CrashLoopBackOff pod...
echo ===============================
kubectl describe pod -l app=lingua-frontend -n lingua-app | findstr -A 20 "CrashLoopBackOff"
echo.

echo 2. Describing RunContainerError pod...
echo ===============================
kubectl describe pod -l app=lingua-frontend -n lingua-app | findstr -A 20 "RunContainerError"
echo.

echo 3. Getting detailed logs for CrashLoopBackOff pod...
echo =============================================
for /f "tokens=*" %%i in ('kubectl get pods -n lingua-app -l app=lingua-frontend --field-selector status.phase!=Running -o jsonpath="{.items[0].metadata.name}"') do set CRASH_POD=%%i
if defined CRASH_POD (
    echo CrashLoopBackOff pod: %CRASH_POD%
    echo Logs:
    kubectl logs %CRASH_POD% -n lingua-app --previous
) else (
    echo No CrashLoopBackOff pod found
)
echo.

echo 4. Getting detailed logs for RunContainerError pod...
echo =============================================
for /f "tokens=*" %%i in ('kubectl get pods -n lingua-app -l app=lingua-frontend --field-selector=status.phase!=Running -o jsonpath="{.items[1].metadata.name}"') do set RUN_POD=%%i
if defined RUN_POD (
    echo RunContainerError pod: %RUN_POD%
    echo Logs:
    kubectl logs %RUN_POD% -n lingua-app --previous
) else (
    echo No RunContainerError pod found
)
echo.

echo 5. Checking if frontend image exists in GCR...
echo ======================================
kubectl get pods -n lingua-app -l app=lingua-frontend -o jsonpath='{.items[*].spec.containers[*].image}'
echo.

echo 6. Checking events for the namespace...
echo =============================
kubectl get events -n lingua-app --sort-by=.metadata.creationTimestamp
echo.

echo ========================================
echo Debug complete!
echo ========================================
pause