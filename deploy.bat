@echo off
echo 🚀 Iniciando proceso de despliegue...

REM Limpiar directorio dist anterior
echo 🧹 Limpiando archivos anteriores...
call npm run clean

REM Construir para producción en subcarpeta
echo 🔨 Construyendo aplicación para producción...
call npm run build:subfolder

REM Verificar si el build fue exitoso
if %errorlevel% equ 0 (
    echo ✅ Build completado exitosamente!
    echo 📁 Archivos generados en: dist/oots-colombia/
    echo.
    echo 📋 Instrucciones de despliegue:
    echo 1. Copia el contenido de 'dist/oots-colombia/' a tu carpeta del dominio
    echo 2. Asegúrate de que el servidor web soporte .htaccess (Apache^)
    echo 3. La aplicación estará disponible en: https://tudominio.com/oots-colombia/
    echo.
    echo 🔧 Configuraciones aplicadas:
    echo - Base href: /oots-colombia/
    echo - Optimización: Habilitada
    echo - Source maps: Deshabilitados
    echo - Compresión: Habilitada
    echo - Cache headers: Configurados
) else (
    echo ❌ Error en el build. Revisa los errores anteriores.
    exit /b 1
)

pause