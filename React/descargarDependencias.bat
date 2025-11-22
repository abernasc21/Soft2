@echo off
setlocal

echo.
echo ==================================================
echo 📦 Iniciando Instalacion de Dependencias - Farmacia Oasis
echo ==================================================
echo.

:: --------------------------------------------------
:: 2. Configuracion del Backend
:: --------------------------------------------------

:: --------------------------------------------------
:: 3. Configuracion del Frontend
:: --------------------------------------------------
echo.
echo === 3. Configurando el Frontend... ===
cd Frontend/FarmaciaOasis
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERROR: No se encuentra el directorio 'Frontend/FarmaciaOasis'.
    echo Asegurese de ejecutar el script desde 'proyectofarmaciaoasis/React'.
    goto :end
)

echo.
echo Instalando dependencias basicas de React...
npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERROR: Fallo la instalacion de dependencias base del Frontend.
    goto :end
)

echo.
echo Instalando Vite (Globalmente)...
npm i -g vite
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️ ADVERTENCIA: La instalacion global de Vite fallo o no es necesaria. Continuamos...
)

echo.
echo Instalando dependencias especificas del Frontend...
npm install @fontsource/montserrat react-responsive react-router-dom axios ^
    @mantine/core @mantine/hooks @mantine/form @mantine/notifications @mantine/modals @mantine/dates @emotion/react ^
    recharts react-intl dayjs @tabler/icons-react html2pdf.js exceljs file-saver
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERROR: Fallo la instalacion de dependencias especificas del Frontend.
    goto :end
)

echo.
echo ✅ Instalacion de Frontend completada.
cd ..\..

:: --------------------------------------------------
:: Finalizacion
:: --------------------------------------------------
echo.
echo ==================================================
echo 🎉 Todas las dependencias han sido instaladas exitosamente.
echo ==================================================
echo.
echo Para ejecutar el proyecto:
echo 1. Inicie el Backend: cd Backend && node index.js
echo 2. Inicie el Frontend: cd Frontend\FarmaciaOasis && npm run dev
echo.

:end
pause
endlocal