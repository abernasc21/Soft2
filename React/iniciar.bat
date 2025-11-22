@echo off
title Iniciando Parachat Farmacia Oasis
echo =====================================
echo Iniciando el backend...
cd Backend
start cmd /k "node index.js"

echo =====================================
echo Iniciando el frontend...
cd ..
cd frontend\farmaciaOasis
start cmd /k "npm run dev"

echo =====================================
echo Todo listo! El servidor y el frontend están corriendo.
pause
