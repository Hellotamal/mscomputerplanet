@echo off
:: ====================================================================
:: M/S COMPUTER PLANET - Automated GitHub Sync Utility
:: Repository: https://github.com/Hellotamal/mscomputerplanet.git
:: ====================================================================

title M/S Computer Planet - GitHub Auto Push Utility

echo ====================================================================
echo   M/S COMPUTER PLANET - AUTOMATED GITHUB REPOSITORY SYNC
echo ====================================================================
echo.

:: Step 1: Stage all changes
echo [1/4] Staging all modified and new files...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to stage files with 'git add'.
    goto ERROR_EXIT
)
echo [OK] Files staged successfully.
echo.

:: Step 2: Prompt for commit message or use auto-generated timestamp
set "commit_msg="
set /p commit_msg="[2/4] Enter commit message (Press ENTER for auto-timestamp): "

if /i "%commit_msg%"=="enter" set "commit_msg="

if "%commit_msg%"=="" (
    set "commit_msg=Auto update: %date% %time%"
)

echo.
echo [3/4] Committing changes with message: "%commit_msg%"...
git commit -m "%commit_msg%"
if %ERRORLEVEL% NEQ 0 (
    echo [NOTE] Nothing to commit or commit failed.
)

echo.
:: Step 3: Push to origin main
echo [4/4] Pushing changes to GitHub (origin/main)...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Git push failed. Please check your internet connection or GitHub authentication.
    goto ERROR_EXIT
)

echo.
echo ====================================================================
echo   [SUCCESS] Website ^& ERP content pushed to GitHub successfully!
echo ====================================================================
goto END

:ERROR_EXIT
echo.
echo ====================================================================
echo   [FAILED] Sync encountered errors. Please check the logs above.
echo ====================================================================

:END
echo.
pause
