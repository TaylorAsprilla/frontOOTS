# OOTS Colombia - Sistema de Gestión Social

<div align="center">

![Angular](https://img.shields.io/badge/Angular-20.1.6-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)

Sistema de gestión y seguimiento de participantes para programas sociales en OOTS Colombia

[Documentación](#documentación) •
[Instalación](#instalación) •
[Desarrollo](#desarrollo) •
[Despliegue](#despliegue)

</div>

---

## Descripción

Aplicación web moderna para la gestión integral de participantes en programas sociales, construida con Angular 20 y las mejores prácticas de desarrollo.

### Características Principales

- **Gestión de Participantes** - Registro completo con datos personales, familiares y socioeconómicos
- **Composición Familiar** - Seguimiento de grupos familiares y relaciones
- **Gestión de Casos** - Creación y seguimiento de casos con 11 pasos de intervención
- **Notas de Progreso** - Registro detallado de evolución de casos
- **Sistema de Autenticación** - Login seguro con JWT y gestión de permisos
- **Gestión de Usuarios** - Administración de usuarios del sistema
- **Configuración Flexible** - Parámetros personalizables del sistema
- **Multiidioma** - Soporte para Español e Inglés
- **Diseño Responsivo** - Interfaz adaptable a cualquier dispositivo
- **Calendario** - Gestión de citas y agenda

## Tecnologías

### Core

- **[Angular 20.1.6](https://angular.io/)** - Framework principal
- **[TypeScript 5.7.2](https://www.typescriptlang.org/)** - Lenguaje de programación
- **[RxJS 7.8.1](https://rxjs.dev/)** - Programación reactiva
- **[Bootstrap 5.3.3](https://getbootstrap.com/)** - Framework CSS

### UI/UX

- **[Ng-Bootstrap](https://ng-bootstrap.github.io/)** - Componentes Angular de Bootstrap
- **[FullCalendar 6.1.15](https://fullcalendar.io/)** - Componente de calendario
- **[SweetAlert2 11.15.2](https://sweetalert2.github.io/)** - Alertas y modales
- **[ApexCharts 4.2.0](https://apexcharts.com/)** - Gráficos y visualizaciones
- **[Feather Icons](https://feathericons.com/)** - Iconografía

### Internacionalización

- **[@jsverse/transloco 7.6.0](https://jsverse.github.io/transloco/)** - Sistema de traducciones i18n

### Formularios y Validación

- **[ngx-intl-tel-input 17.0.0](https://www.npmjs.com/package/ngx-intl-tel-input)** - Input de teléfono internacional
- **[google-libphonenumber](https://github.com/google/libphonenumber)** - Validación de números telefónicos

### Herramientas de Desarrollo

- **[Angular CLI 20.1.5](https://cli.angular.io/)** - Herramientas de línea de comandos
- **[Karma](https://karma-runner.github.io/)** - Test runner
- **[Jasmine](https://jasmine.github.io/)** - Framework de testing

## Instalación

### Prerrequisitos

Asegúrate de tener instalado:

```bash
Node.js >= 18.x
npm >= 9.x
Angular CLI >= 20.x
```

### Verificar versiones

```bash
node --version
npm --version
ng version
```

### Clonar repositorio

```bash
git clone https://github.com/tu-organizacion/oots-colombia.git
cd oots-colombia
```

### Instalar dependencias

```bash
npm install
```

## Desarrollo

### Servidor de desarrollo

Inicia el servidor de desarrollo en `http://localhost:4200/`:

```bash
npm run start:dev
# o
ng serve
```

La aplicación se recargará automáticamente cuando hagas cambios en el código fuente.

### Build de producción

```bash
# Build estándar
npm run build:prod

# Build para OOTS (con configuración específica)
npm run build:oots

# Build para despliegue en subcarpeta
npm run build:subfolder
```

### Otros comandos útiles

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests e2e
npm run e2e

# Analizar tamaño del bundle
npm run analyze

# Limpiar directorio dist
npm run clean

# Verificar código con linter
ng lint
```

## Estructura del Proyecto

```
oots-colombia/
├── src/
│   ├── app/
│   │   ├── auth/                    # Módulo de autenticación
│   │   │   ├── account/             # Login, registro
│   │   │   └── auth.routes.ts
│   │   │
│   │   ├── core/                    # Servicios y funcionalidades core
│   │   │   ├── enums/               # Enumeraciones
│   │   │   ├── guards/              # Route guards (AuthGuard)
│   │   │   ├── helpers/             # Funciones helper
│   │   │   ├── interceptors/        # HTTP interceptors (AuthInterceptor)
│   │   │   ├── interfaces/          # Interfaces TypeScript
│   │   │   ├── models/              # Modelos de datos
│   │   │   ├── resolvers/           # Route resolvers
│   │   │   └── services/            # Servicios (API, auth, etc.)
│   │   │
│   │   ├── layout/                  # Componentes de layout
│   │   │   ├── detached/            # Layout detached
│   │   │   ├── horizontal/          # Layout horizontal
│   │   │   ├── public-layout/       # Layout público (login)
│   │   │   ├── shared/              # Componentes compartidos de layout
│   │   │   ├── two-column-menu/     # Layout de dos columnas
│   │   │   └── vertical/            # Layout vertical (sidebar)
│   │   │
│   │   ├── pages/                   # Páginas de la aplicación
│   │   │   ├── participants/        # Gestión de participantes
│   │   │   │   ├── create-participant/
│   │   │   │   ├── participant-detail/
│   │   │   │   └── participant-list/
│   │   │   │
│   │   │   ├── cases/               # Gestión de casos
│   │   │   │   ├── create-case/     # Wizard de 11 pasos
│   │   │   │   ├── case-detail/
│   │   │   │   └── case-list/
│   │   │   │
│   │   │   ├── user-management/     # Gestión de usuarios
│   │   │   │   ├── user-create/
│   │   │   │   └── user-details/
│   │   │   │
│   │   │   ├── configuration/       # Configuración del sistema
│   │   │   │   ├── academic-level/
│   │   │   │   ├── approach-types/
│   │   │   │   ├── document-types/
│   │   │   │   ├── family-relationship/
│   │   │   │   ├── genders/
│   │   │   │   ├── health-insurance/
│   │   │   │   ├── housing-type/
│   │   │   │   ├── identified-situations/  # ✨ Nuevo
│   │   │   │   ├── income-level/
│   │   │   │   ├── income-source/
│   │   │   │   └── marital-status/
│   │   │   │
│   │   │   ├── dashboard/           # Dashboard principal
│   │   │   └── ...                  # Otras páginas
│   │   │
│   │   ├── shared/                  # Componentes y utilidades compartidas
│   │   │   ├── advanced-table/      # Tabla avanzada reutilizable
│   │   │   ├── components/          # Componentes compartidos
│   │   │   ├── page-title/          # Componente de título de página
│   │   │   ├── ui/                  # Componentes UI
│   │   │   └── widget/              # Widgets
│   │   │
│   │   ├── app.component.ts         # Componente raíz
│   │   ├── app.config.ts            # Configuración de la app
│   │   └── app.routes.ts            # Rutas principales
│   │
│   ├── assets/                      # Recursos estáticos
│   │   ├── fonts/                   # Fuentes
│   │   ├── i18n/                    # Archivos de traducción
│   │   │   ├── en.json              # Inglés
│   │   │   └── es.json              # Español
│   │   ├── images/                  # Imágenes
│   │   └── scss/                    # Estilos globales SCSS
│   │
│   ├── environments/                # Configuración de entornos
│   │   ├── environment.ts           # Desarrollo
│   │   └── environment.prod.ts      # Producción
│   │
│   ├── index.html                   # HTML principal
│   ├── main.ts                      # Entry point
│   └── styles.scss                  # Estilos globales
│
├── docs/                            # 📚 Documentación
│   ├── README.md                    # Índice de documentación
│   ├── AUTH_SYSTEM.md               # Sistema de autenticación
│   ├── CONFIGURATION.md             # Configuración de módulos
│   ├── DEPLOYMENT.md                # Guía de despliegue
│   └── DEVELOPMENT.md               # Guía de desarrollo
│
├── angular.json                     # Configuración de Angular
├── package.json                     # Dependencias y scripts
├── tsconfig.json                    # Configuración de TypeScript
└── README.md                        # Este archivo
```

## Configuración

### Variables de Entorno

#### Desarrollo (`src/environments/environment.ts`)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  apiTimeout: 30000,
  enableLogging: true,
  defaultLanguage: 'es',
};
```

#### Producción (`src/environments/environment.prod.ts`)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.ootscolombia.com/api/v1',
  apiTimeout: 30000,
  enableLogging: false,
  defaultLanguage: 'es',
};
```

### Configuración de Idioma

Editar `src/app/transloco.config.ts` para cambiar el idioma predeterminado:

```typescript
export const translocoConfig: TranslocoConfig = {
  availableLangs: ['es', 'en'],
  defaultLang: 'es',
  fallbackLang: 'es',
  reRenderOnLangChange: true,
  prodMode: environment.production,
};
```

## Internacionalización

### Idiomas Soportados

- **Español** (predeterminado) - `es.json`
- **Inglés** - `en.json`

### Agregar Nuevas Traducciones

1. Edita los archivos en `src/assets/i18n/`:

   - `es.json` para español
   - `en.json` para inglés

2. Estructura de traducciones:

```json
{
  "module": {
    "section": {
      "key": "Valor traducido"
    }
  }
}
```

3. Uso en componentes:

```typescript
// En TypeScript
this.transloco.translate('module.section.key');

// En HTML
{
  {
    'module.section.key' | transloco;
  }
}
```

### Cambiar Idioma en Tiempo de Ejecución

```typescript
// Inyectar el servicio
constructor(private transloco: TranslocoService) {}

// Cambiar idioma
this.transloco.setActiveLang('en');
```

## Documentación

La documentación completa del proyecto está organizada en la carpeta `docs/`:

### Guías Disponibles

| Documento                                             | Descripción                                          |
| ----------------------------------------------------- | ---------------------------------------------------- |
| [**Índice de Documentación**](docs/README.md)         | Punto de entrada a toda la documentación             |
| [**Sistema de Autenticación**](docs/AUTH_SYSTEM.md)   | Implementación de JWT, login, guards e interceptores |
| [**Configuración de Módulos**](docs/CONFIGURATION.md) | Configuración de módulos del sistema                 |
| [**Guía de Despliegue**](docs/DEPLOYMENT.md)          | Instrucciones para desplegar en producción           |
| [**Guía de Desarrollo**](docs/DEVELOPMENT.md)         | Estándares de código y mejores prácticas             |

### Temas Documentados

- Sistema de autenticación con JWT
- Estructura de componentes y servicios
- Módulos de configuración (géneros, tipos de documento, etc.)
- Gestión de participantes y casos
- Situaciones identificadas (nuevo)
- Menú de configuración desplegable

## Despliegue

### Preparación para Producción

1. **Actualizar variables de entorno** en `environment.prod.ts`
2. **Construir la aplicación**:

```bash
npm run build:oots
```

3. **Los archivos compilados** estarán en `dist/oots-colombia/browser/`

### Despliegue en Servidor

#### Opción 1: Servidor Web (Apache/Nginx)

```bash
# Copiar archivos al servidor
scp -r dist/oots-colombia/browser/* user@server:/var/www/html/oots/

# Configurar servidor web para servir la aplicación
```

#### Opción 2: Usando Scripts de Despliegue

```bash
# Windows
deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

### Configuración de Servidor Web

#### Nginx

```nginx
server {
    listen 80;
    server_name ootscolombia.com;
    root /var/www/html/oots;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Caché para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Apache (.htaccess)

```apache
RewriteEngine On
RewriteBase /oots/
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /oots/index.html [L]
```

## Testing

### Ejecutar Tests Unitarios

```bash
npm run test
```

Los tests se ejecutan con Karma y Jasmine.

### Ejecutar Tests E2E

```bash
npm run e2e
```

### Cobertura de Tests

```bash
ng test --code-coverage
```

Los reportes de cobertura estarán en `coverage/`.

## Contribución

### Flujo de Trabajo

1. **Fork** el repositorio
2. **Crea una rama** para tu feature:
   ```bash
   git checkout -b feature/nombre-feature
   ```
3. **Commit** tus cambios:
   ```bash
   git commit -m 'feat: Agregar nueva funcionalidad'
   ```
4. **Push** a la rama:
   ```bash
   git push origin feature/nombre-feature
   ```
5. **Abre un Pull Request**

### Convenciones de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formato, espacios en blanco
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

### Estándares de Código

- **Usar TypeScript strict mode**
- **Seguir Angular Style Guide**
- **Documentar métodos complejos**
- **Escribir tests para nueva funcionalidad**
- **Usar traduciones (i18n) para todo texto visible**

## Solución de Problemas

### Error: "Cannot connect to server"

**Causa:** Backend no está corriendo o URL incorrecta

**Solución:**

```bash
# Verificar que el backend esté corriendo
curl http://localhost:3000/api/v1/health

# Verificar environment.apiUrl
```

### Error: "Token expired"

**Causa:** Token JWT ha expirado

**Solución:** Hacer logout y login nuevamente

### Error de compilación

**Causa:** Dependencias desactualizadas o caché corrupto

**Solución:**

```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run clean
npm run build:oots
```

### Problemas de CORS

**Causa:** Backend no permite peticiones desde el frontend

**Solución:** Configurar CORS en el backend para permitir el origen del frontend

## Métricas del Proyecto

### Tamaño del Bundle (Producción)

- **Initial Bundle**: ~2.07 MB
- **Main Bundle**: ~227 kB (gzipped)
- **Lazy Chunks**: Cargados bajo demanda

### Performance

- **Lighthouse Score**: 90+ (objetivo)
- **First Contentful Paint**: <2s
- **Time to Interactive**: <3s

## Versionado

Este proyecto usa [Semantic Versioning](https://semver.org/):

- **MAJOR**: Cambios incompatibles con versiones anteriores
- **MINOR**: Nueva funcionalidad compatible
- **PATCH**: Correcciones de bugs

**Versión actual**: 1.1.0

### Changelog

Ver [CHANGELOG.md](CHANGELOG.md) para el historial completo de cambios.

## Licencia

Este proyecto es **privado y confidencial**. Todos los derechos reservados.

## Soporte

### Equipo de Desarrollo

Para soporte técnico o consultas:

- Email: desarrollo@ootscolombia.com
- Slack: #oots-colombia-dev
- Issues: [GitHub Issues](https://github.com/tu-organizacion/oots-colombia/issues)

### Recursos Útiles

- [Documentación de Angular](https://angular.io/docs)
- [Guía de TypeScript](https://www.typescriptlang.org/docs/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [Transloco Documentation](https://jsverse.github.io/transloco/)

## Roadmap

### Completado (v1.1.0)

- Sistema de autenticación con JWT
- Gestión de participantes
- Gestión de casos (wizard de 11 pasos)
- Gestión de usuarios
- Módulos de configuración
- Situaciones identificadas
- Menú de configuración desplegable
- Sistema multiidioma (ES/EN)

### En Desarrollo (v1.2.0)

- Dashboard con estadísticas
- [ ] Reportes exportables
- Sistema de notificaciones
- Gestión de documentos
- Firma digital de documentos

### Planificado (v2.0.0)

- Módulo de genograma
- Sistema de mensajería interna
- Integración con servicios externos
- App móvil (React Native)
- Sistema de auditoría completo

---

<div align="center">

**Desarrollado para OOTS Colombia**

[![Angular](https://img.shields.io/badge/Made%20with-Angular-DD0031?style=flat&logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/Made%20with-TypeScript-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)

</div>
