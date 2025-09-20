@echo off
color 0A
title Lingua Phone - Cluster Resource Check

echo ========================================
echo     LINGUA PHONE CLUSTER RESOURCE CHECK
echo ========================================
echo.

echo 1. Cluster info...
echo ============
kubectl cluster-info
echo.

echo 2. All namespaces...
echo ==============
kubectl get namespaces
echo.

echo 3. All resources in lingua-app namespace...
echo ===============================
kubectl get all -n lingua-app
echo.

echo 4. ConfigMaps in lingua-app namespace...
echo =========================
kubectl get configmap -n lingua-app -o yaml
echo.

echo 5. Secrets in lingua-app namespace...
echo ======================
kubectl get secrets -n lingua-app
echo.

echo 6. Ingress resources (if any)...
echo ==================
kubectl get ingress -n lingua-app
echo.

echo 7. Events in lingua-app namespace...
echo =======================
kubectl get events -n lingua-app --sort-by='.lastTimestamp'
echo.

echo ========================================
echo           RESOURCE CHECK COMPLETE
echo ========================================
echo.
echo Review all the information above to identify any configuration issues.
echo.
pause