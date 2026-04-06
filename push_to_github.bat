@echo off
echo ===================================================
echo Pushing local files to GitHub (Bypassing PowerShell)
echo ===================================================
echo.

echo 1. Staging all modified files...
git add .
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to stage files. Make sure Git is installed.
    pause
    exit /b
)

echo 2. Committing changes...
git commit -m "Force pushing updated package.json and Supabase components"
IF %ERRORLEVEL% NEQ 0 (
    echo [INFO] No changes to commit, or commit failed.
)

echo 3. Pushing to GitHub...
git push
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to push to GitHub. Check your internet or Git credentials.
    pause
    exit /b
)

echo.
echo ===================================================
echo SUCCESS! Your code has been forced to GitHub!
echo Please check Cloudflare now!
echo ===================================================
pause
