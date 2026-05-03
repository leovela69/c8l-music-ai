@echo off
title C.8.L. MUSIC AI - LANZADOR DE AGENCIA
echo ===================================================
echo   C.8.L. MUSIC AI // OMNI-PROTOCOLO ACTIVADO
echo ===================================================
echo.

:: Comprobar si Node.js existe
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] No se encuentra Node.js instalado o necesitas reiniciar.
    echo.
    echo 1. Si acabas de instalarlo, REINICIA tu computadora.
    echo 2. Si no lo has instalado, ve a nodejs.org
    echo.
    pause
    exit /b
)

echo [1/3] INSTALANDO DEPENDENCIAS...
if not exist node_modules (
    call npm install
) else (
    echo Dependencias ya encontradas.
)

echo.
echo [2/3] COMPILANDO INTERFAZ CUANTICA...
call npm run build

echo.
echo [3/3] INICIANDO SERVIDOR...
echo.
echo Entra en: http://localhost:3001
echo.
call npm run server

echo.
echo El servidor se ha detenido.
pause
