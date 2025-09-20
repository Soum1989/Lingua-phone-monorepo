@echo off
color 0A
title Lingua Phone - Check Frontend Logs

echo ========================================
echo Lingua Phone - Check Frontend Logs
echo ========================================
echo.

echo Getting logs for frontend pods...
echo ================================
kubectl logs -l app=lingua-frontend -n lingua-app --tail=20
echo.

echo If you see "host not found in upstream" errors, the DNS resolution is still not working correctly.
echo.

pause