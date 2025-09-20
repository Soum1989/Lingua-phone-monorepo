@echo off
color 0A
title Lingua Phone - Show All Messages

echo ========================================
echo Lingua Phone - Show All Messages
echo ========================================
echo.

echo 1. COMPLETION_MESSAGE.txt
echo =====================
type COMPLETION_MESSAGE.txt
echo.
echo ========================================
echo.

echo 2. FINAL_SUMMARY.md (first 50 lines)
echo =====================
more < FINAL_SUMMARY.md
echo.
echo ========================================
echo.

echo 3. DEPLOYMENT_STATUS.md (first 50 lines)
echo =====================
more < DEPLOYMENT_STATUS.md
echo.
echo ========================================
echo.

echo 4. README.txt
echo =====================
type README.txt
echo.
echo ========================================
echo.

echo All messages displayed.
echo For full content of the markdown files, please open them directly in a text editor.
echo.

pause