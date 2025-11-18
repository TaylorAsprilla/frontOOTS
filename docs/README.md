# Documentación Técnica - OOTS Colombia

<div align="center">

![Documentation](https://img.shields.io/badge/Documentation-Complete-success?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.2.0-blue?style=for-the-badge)

Documentación completa del sistema de gestión social OOTS Colombia

</div>

---

## Índice de Documentación

### Principal

- **[README Principal](../README.md)** - Descripción general, instalación y primeros pasos

### Autenticación y Seguridad

- **[Sistema de Autenticación](AUTH_SYSTEM.md)** - Implementación completa de:

  - Login con JWT
  - Interceptores HTTP
  - Guards de ruta
  - Almacenamiento de tokens
  - Validación de sesiones
  - Flujos de autenticación

- **[Gestión de Contraseñas](PASSWORD_MANAGEMENT.md)** - Sistema completo de contraseñas:
  - Cambiar contraseña (usuarios autenticados)
  - Recuperar contraseña (forgot password)
  - Restablecer contraseña (reset con token)
  - Validaciones y seguridad
  - Flujos de usuario

### Configuración

- **[Módulos de Configuración](CONFIGURATION.md)** - Documentación de todos los módulos de configuración:
  - Niveles Académicos
  - Tipos de Consulta
  - Tipos de Documento
  - Relaciones Familiares
  - Géneros
  - Seguros de Salud
  - Tipos de Vivienda
  - **Situaciones Identificadas**
  - Niveles de Ingreso
  - Fuentes de Ingreso
  - Estados Civiles

### Gestión de Datos

- **[Gestión de Participantes](PARTICIPANTS.md)** - Módulo de participantes (Planificado)
- **[Gestión de Casos](CASES.md)** - Sistema de casos con wizard de 11 pasos (Planificado)
- **[Gestión de Usuarios](USER_MANAGEMENT.md)** - Administración de usuarios (Planificado)

### Perfil y Cuenta

- **Perfil de Usuario** - Gestión de cuenta personal:
  - Ver y editar información personal
  - Gestión de redes sociales
  - Actualización de datos de contacto
  - Integración con sistema de autenticación

### Despliegue y Producción

- **[Guía de Despliegue](DEPLOYMENT.md)** - Instrucciones para producción (Planificado)

### Desarrollo

- **[Guía de Desarrollo](DEVELOPMENT.md)** - Estándares y buenas prácticas (Planificado)

### Herramientas

- **[Acciones de Tabla](TABLE_ACTIONS.md)** - Implementación de botones dinámicos en tablas

---

## Inicio Rápido

### Para Desarrolladores Nuevos

1. **Lee el [README principal](../README.md)** para entender la estructura del proyecto
2. **Revisa [Sistema de Autenticación](AUTH_SYSTEM.md)** para entender el flujo de seguridad
3. **Consulta [Gestión de Contraseñas](PASSWORD_MANAGEMENT.md)** para implementación de password flows
4. **Consulta módulos específicos** según tu área de trabajo

### Para Configuración del Sistema

1. **[Módulos de Configuración](CONFIGURATION.md)** - Gestionar parámetros del sistema

### Para Despliegue

1. **[Guía de Despliegue](DEPLOYMENT.md)** - Paso a paso para poner en producción

---

## Notas Importantes

### Convenciones de Documentación

**Hacer:**

- ✅ Mantener documentación actualizada con cada feature importante
- ✅ Usar ejemplos de código cuando sea relevante
- ✅ Incluir capturas de pantalla si es necesario
- ✅ Documentar endpoints de API utilizados
- ✅ Agregar troubleshooting para problemas comunes
- ✅ Documentar sistema de traducciones (i18n)

**Evitar:**

- ❌ Documentos temporales (eliminar después de implementar)
- ❌ Documentación obsoleta
- ❌ Código sin comentarios en ejemplos complejos
- ❌ Archivos `_OLD` o duplicados

---

## Estado de Documentación

| Documento                | Estado         | Última Actualización |
| ------------------------ | -------------- | -------------------- |
| README Principal         | ✅ Completo    | Nov 2025             |
| Sistema de Autenticación | ✅ Completo    | Oct 2025             |
| Gestión de Contraseñas   | ✅ Completo    | Nov 2025             |
| Módulos de Configuración | ✅ Completo    | Nov 2025             |
| Acciones de Tabla        | ✅ Completo    | Oct 2025             |
| Guía de Despliegue       | 📋 Planificado | -                    |
| Guía de Desarrollo       | 📋 Planificado | -                    |

**Leyenda:**

- ✅ Completo y actualizado
- 🔄 En progreso
- 📋 Planificado

---

## Nuevas Funcionalidades (v1.2.0)

### Gestión Completa de Contraseñas

- ✅ Cambiar contraseña para usuarios autenticados
- ✅ Recuperación de contraseña vía email
- ✅ Restablecimiento con token seguro
- ✅ Validaciones robustas y mensajes de error claros

### Perfil de Usuario Editable

- ✅ Ver información personal del usuario autenticado
- ✅ Editar datos personales (nombre, apellido, teléfono, cargo)
- ✅ Gestión de enlaces a redes sociales (5 plataformas)
- ✅ Integración con backend API

### Sistema i18n Completo

- ✅ 80+ claves de traducción agregadas
- ✅ Soporte completo en español
- ✅ Preparado para inglés y otros idiomas
- ✅ Componentes completamente traducidos

---

## Contribuir a la Documentación

### Cómo Agregar Nueva Documentación

1. **Crear archivo** en formato Markdown (`.md`)
2. **Colocar** en la carpeta `docs/`
3. **Nombrar** de forma descriptiva: `NOMBRE_DESCRIPTIVO.md`
4. **Actualizar** este índice con enlace al nuevo documento
5. **Seguir** el formato estándar de documentación
6. **Eliminar** archivos obsoletos (\_OLD, duplicados)

---

## Contacto

¿Tienes preguntas sobre la documentación?

- Email: desarrollo@ootscolombia.com
- Slack: #oots-colombia-docs
- GitHub Issues: Para reportar errores en documentación

---

## Enlaces Útiles

### Documentación Externa

- **Angular:** https://angular.io/docs
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Bootstrap:** https://getbootstrap.com/docs/
- **Transloco (i18n):** https://jsverse.github.io/transloco/
- **RxJS:** https://rxjs.dev/guide/overview

### Herramientas de Desarrollo

- **Angular CLI:** https://angular.io/cli
- **SweetAlert2:** https://sweetalert2.github.io/
- **ApexCharts:** https://apexcharts.com/docs/

---

<div align="center">

**Documentación mantenida por el equipo de desarrollo de OOTS Colombia**

_Última actualización: Noviembre 2025 - v1.2.0_

</div>
