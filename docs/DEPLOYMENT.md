# 🚀 Guía de Despliegue - OOTS Colombia

## 📋 Resumen

Esta guía te ayudará a desplegar la aplicación OOTS Colombia en una carpeta específica de tu dominio.

## 🛠️ Preparación

### Prerrequisitos

- Node.js 18+ instalado
- Angular CLI instalado globalmente
- Acceso al servidor web de destino

### Instalación de dependencias

```bash
npm install
```

## 🔨 Build para Producción

### Opción 1: Build estándar (dominio raíz)

```bash
npm run build:prod
```

### Opción 2: Build para subcarpeta (recomendado)

```bash
npm run build:subfolder
```

### Opción 3: Script automático

```bash
# En Linux/Mac
./deploy.sh

# En Windows
deploy.bat
```

## 📁 Estructura de Archivos Generados

Después del build, encontrarás los archivos en `dist/oots-colombia/`:

```
dist/oots-colombia/
├── index.html              # Página principal
├── main.[hash].js          # Código principal de la aplicación
├── polyfills.[hash].js     # Polyfills para compatibilidad
├── runtime.[hash].js       # Runtime de Angular
├── styles.[hash].css       # Estilos compilados
├── assets/                 # Recursos estáticos
├── .htaccess              # Configuración de Apache
└── favicon.ico            # Ícono de la aplicación
```

## 🌐 Despliegue en el Servidor

### Paso 1: Subir archivos

1. Conéctate a tu servidor via FTP/SFTP o panel de control
2. Navega a la carpeta de tu dominio (ej: `public_html/`)
3. Crea una carpeta llamada `oots-colombia`
4. Sube **todo el contenido** de `dist/oots-colombia/` a esta carpeta

### Paso 2: Configuración del servidor

#### Para Apache (recomendado)

- El archivo `.htaccess` ya está incluido y configurado
- Asegúrate de que el módulo `mod_rewrite` esté habilitado

#### Para Nginx

Agrega esta configuración a tu archivo de sitio:

```nginx
location /oots-colombia {
    try_files $uri $uri/ /oots-colombia/index.html;

    # Compresión
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache headers
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🔧 Configuraciones Aplicadas

### Optimizaciones de Build

- ✅ Minificación de código habilitada
- ✅ Tree-shaking para eliminar código no usado
- ✅ Bundling optimizado
- ✅ Compresión de assets
- ✅ Cache headers configurados
- ✅ Source maps deshabilitados en producción

### Configuraciones de Ruta

- **Base Href**: `/oots-colombia/`
- **Deploy URL**: `/oots-colombia/`
- **Ruteo**: Configurado para single-page application (SPA)

### Límites de Budget

- **Bundle inicial**: Máximo 5MB
- **Estilos por componente**: Máximo 10KB

## 🌍 URLs de Acceso

Después del despliegue, la aplicación estará disponible en:

- **URL principal**: `https://tudominio.com/oots-colombia/`
- **Rutas específicas**: Se manejan automáticamente por Angular Router

## 🔍 Verificación del Despliegue

### Checklist post-despliegue

- [ ] La página principal carga correctamente
- [ ] La navegación entre rutas funciona
- [ ] Los recursos (CSS, JS, imágenes) se cargan sin errores
- [ ] No hay errores 404 en la consola del navegador
- [ ] Las funcionalidades principales están operativas

### Problemas comunes y soluciones

#### Error 404 en rutas

**Problema**: Las rutas de Angular devuelven 404
**Solución**: Verificar que el archivo `.htaccess` esté presente y que `mod_rewrite` esté habilitado

#### Recursos no cargan

**Problema**: CSS, JS o imágenes no cargan
**Solución**: Verificar que `baseHref` y `deployUrl` estén configurados correctamente

#### Página en blanco

**Problema**: La aplicación muestra una página en blanco
**Solución**: Revisar la consola del navegador para errores de JavaScript y verificar la configuración del entorno

## 📊 Análisis de Bundle

Para analizar el tamaño del bundle y optimizar:

```bash
npm run analyze
```

Esto abrirá una visualización del bundle en tu navegador.

## 🔄 Actualizaciones

Para actualizar la aplicación:

1. Realiza los cambios necesarios en el código
2. Ejecuta el proceso de build nuevamente
3. Reemplaza los archivos en el servidor
4. Limpia la caché del navegador si es necesario

## 📞 Soporte

Si encuentras problemas durante el despliegue:

1. Revisa la consola del navegador para errores
2. Verifica los logs del servidor web
3. Consulta la documentación de Angular para problemas específicos

---

**Nota**: Esta configuración está optimizada para despliegue en una subcarpeta del dominio. Si necesitas desplegarlo en el dominio raíz, utiliza el comando `npm run build:prod` y ajusta las configuraciones según sea necesario.
