#!/bin/bash

# Script de despliegue para OOTS Colombia
echo "🚀 Iniciando proceso de despliegue..."

# Limpiar directorio dist anterior
echo "🧹 Limpiando archivos anteriores..."
npm run clean

# Construir para producción en subcarpeta
echo "🔨 Construyendo aplicación para producción..."
npm run build:subfolder

# Verificar si el build fue exitoso
if [ $? -eq 0 ]; then
    echo "✅ Build completado exitosamente!"
    echo "📁 Archivos generados en: dist/oots-colombia/"
    echo ""
    echo "📋 Instrucciones de despliegue:"
    echo "1. Copia el contenido de 'dist/oots-colombia/' a tu carpeta del dominio"
    echo "2. Asegúrate de que el servidor web soporte .htaccess (Apache)"
    echo "3. La aplicación estará disponible en: https://tudominio.com/oots-colombia/"
    echo ""
    echo "🔧 Configuraciones aplicadas:"
    echo "- Base href: /oots-colombia/"
    echo "- Optimización: Habilitada"
    echo "- Source maps: Deshabilitados"
    echo "- Compresión: Habilitada"
    echo "- Cache headers: Configurados"
else
    echo "❌ Error en el build. Revisa los errores anteriores."
    exit 1
fi