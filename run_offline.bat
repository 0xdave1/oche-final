@echo off
setlocal
cd /d "%~dp0"

if not exist out (
  echo Building static offline bundle...
  call npm install
  call npm run build
)

echo Opening offline bundle...
start "" "%~dp0out\index.html"
endlocal
