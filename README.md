# 🌟 OOTS Colombia - Sistema de Gestión Social

Sistema de gestión y seguimiento de participantes para OOTS Colombia, construido con Angular 20.

## 📋 Descripción

Aplicación web para la gestión integral de participantes en programas sociales, incluyendo:

- 📝 Registro y seguimiento de participantes
- 👥 Gestión de composición familiar
- 📊 Planes de intervención personalizados
- 📈 Notas de progreso y cierre de casos
- 🌐 Sistema multiidioma (Español/Inglés)
- 👤 Gestión de usuarios y permisos

## 🚀 Tecnologías

- **Angular**: 20.1.6
- **TypeScript**: 5.7.2
- **Bootstrap**: 5.3.3
- **Transloco**: Sistema de internacionalización
- **SweetAlert2**: Alertas y notificaciones
- **Chart.js**: Visualización de datos
- **FullCalendar**: Gestión de calendario

## 🛠️ Instalación

### Prerrequisitos

```bash
Node.js >= 18.x
npm >= 9.x
Angular CLI >= 20.x
```

### Instalar dependencias

```bash
npm install
```

## 💻 Comandos de Desarrollo

### Servidor de desarrollo

```bash
npm run start:dev
# La aplicación estará disponible en http://localhost:4200/
```

### Build de producción

```bash
# Build estándar
npm run build:prod

# Build para subcarpeta de dominio
npm run build:subfolder
```

### Análisis de bundle

```bash
npm run analyze
```

### Limpiar directorio dist

```bash
npm run clean
```

## 📦 Despliegue

Para desplegar la aplicación en producción, consulta la [Guía de Despliegue](DEPLOYMENT.md).

### Despliegue rápido

```bash
# Windows
deploy.bat

# Linux/Mac
./deploy.sh
```

## 🌍 Internacionalización

El proyecto soporta múltiples idiomas:

- 🇪🇸 Español (predeterminado)
- 🇺🇸 Inglés

Los archivos de traducción se encuentran en `src/assets/i18n/`.

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── auth/              # Autenticación
│   ├── core/              # Servicios y guards globales
│   ├── layout/            # Componentes de layout
│   ├── pages/
│   │   ├── participants/  # Módulo de participantes
│   │   ├── user-management/ # Gestión de usuarios
│   │   └── dashboard/     # Dashboard principal
│   └── shared/            # Componentes compartidos
├── assets/
│   ├── i18n/             # Archivos de traducción
│   ├── images/           # Recursos de imagen
│   └── scss/             # Estilos globales
└── environments/         # Configuraciones de entorno
```

## 🔧 Configuración

### Variables de Entorno

Edita `src/environments/environment.prod.ts` para configuración de producción:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.ootscolombia.com/api/v1',
  apiTimeout: 30000,
  enableLogging: false,
};
```

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 📞 Soporte

Para soporte técnico, contacta al equipo de desarrollo.

---

Desarrollado con ❤️ para OOTS Colombia
