@echo off
cd /d "%~dp0"
for /r src %%f in (*.js) do (
  if /I not "%%~nxf"=="storage.js" ren "%%f" "%%~nf.jsx"
)
