@echo off
cd /d "%~dp0"
echo Yomu: http://127.0.0.1:4173
echo Kapatmak icin bu pencerede Ctrl+C tuslarina basin.
node scripts/server.mjs --open
if errorlevel 1 pause
