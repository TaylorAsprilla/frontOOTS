# 🔐 Sistema de Autenticación - OOTS Colombia

## Descripción General

Sistema de autenticación basado en JWT (JSON Web Tokens) integrado con el backend de OOTS Colombia. Implementa login seguro, almacenamiento de tokens, manejo de sesiones y protección de rutas.

## 📋 Componentes Principales

### 1. Interfaces y Modelos

**Archivo:** `src/app/core/interfaces/auth.interface.ts`

Interfaces TypeScript que definen la estructura de datos de autenticación:

```typescript
LoginRequest; // Solicitud de login (email, password)
LoginResponse; // Respuesta completa del API
AuthData; // Datos de autenticación (token, usuario)
AuthUser; // Información del usuario
AuthenticatedUser; // Usuario autenticado con token
AuthError; // Errores de autenticación
```

### 2. Servicios

#### AuthenticationService

**Archivo:** `src/app/core/service/auth.service.ts`

Servicio principal de autenticación:

**Métodos:**

- `login(email, password)` - Autentica usuario con el backend
- `logout()` - Cierra sesión y limpia datos almacenados
- `currentUser()` - Obtiene el usuario autenticado actual
- `isAuthenticated()` - Verifica si hay sesión activa
- `getToken()` - Obtiene el token JWT actual
- `isTokenExpired()` - Verifica si el token ha expirado
- `validateToken()` - Valida token y obtiene datos completos del usuario
- `getCurrentUserComplete()` - Obtiene perfil completo del usuario actual

**Endpoints:**

- Login: `POST ${environment.apiUrl}/auth/login`
- Validate: `POST ${environment.apiUrl}/auth/validate`

#### TokenStorageService

**Archivo:** `src/app/core/services/token-storage.service.ts`

Gestiona el almacenamiento seguro de tokens:

**Métodos:**

- `saveUser(user)` - Guarda usuario básico en localStorage
- `saveUserComplete(user)` - Guarda usuario completo con todos los datos
- `getUser()` - Recupera usuario almacenado (básico o completo)
- `getUserComplete()` - Recupera usuario completo si está disponible
- `getToken()` - Obtiene solo el token JWT
- `isTokenExpired()` - Verifica expiración del token
- `isAuthenticated()` - Verifica autenticación válida
- `clearUser()` - Elimina datos de sesión
- `getTimeUntilExpiration()` - Tiempo restante del token
- `updateToken(token, expiresIn)` - Actualiza token (para refresh)

### 3. Interceptores HTTP

#### AuthInterceptor

**Archivo:** `src/app/core/interceptors/auth.interceptor.ts`

Interceptor que:

- ✅ Agrega automáticamente el token JWT a todas las peticiones HTTP
- ✅ Añade header `Authorization: Bearer {token}`
- ✅ Maneja errores 401 (no autorizado)
- ✅ Redirige al login cuando el token es inválido

**Configuración:** Registrado en `src/app.config.ts`

### 4. Guards de Ruta

#### AuthGuard

**Archivo:** `src/app/core/guards/auth.guard.ts`

Protege rutas que requieren autenticación:

- ✅ Verifica sesión activa antes de permitir acceso
- ✅ Valida que el token no haya expirado
- ✅ Redirige a `/auth/login` si no está autenticado
- ✅ Preserva URL de retorno en query params

**Uso:**

```typescript
{
  path: 'dashboard',
  canActivate: [AuthGuard],
  component: DashboardComponent
}
```

### 5. Componente de Login

**Archivo:** `src/app/auth/account/login/login.component.ts`

Formulario de inicio de sesión con:

- ✅ Validación de email y contraseña
- ✅ Manejo de errores traducidos
- ✅ Indicador de carga (loader)
- ✅ Toggle para mostrar/ocultar contraseña
- ✅ Recordar sesión (checkbox)
- ✅ Internacionalización completa

## 🔄 Flujo de Autenticación

### 1. Login

```
Usuario ingresa credenciales
    ↓
LoginComponent.onSubmit()
    ↓
AuthenticationService.login(email, password)
    ↓
POST /api/v1/auth/login
    ↓
Backend responde con JWT y datos de usuario
    ↓
TokenStorageService.saveUser()
    ↓
Guarda en localStorage: { token, user, expiresAt }
    ↓
Router.navigate([returnUrl])
```

### 2. Peticiones API Autenticadas

```
Componente hace HTTP request
    ↓
AuthInterceptor.intercept()
    ↓
Lee token de localStorage
    ↓
Agrega header: Authorization: Bearer {token}
    ↓
Envía request al backend
    ↓
Si 401: redirect a login
```

### 3. Validación de Token y Datos Completos

```
App se inicia → AppComponent.ngOnInit()
    ↓
Verifica si hay token en localStorage
    ↓
AuthenticationService.validateToken()
    ↓
POST /api/v1/auth/validate (token en header)
    ↓
Backend valida token y retorna datos completos
    ↓
TokenStorageService.saveUserComplete()
    ↓
Actualiza localStorage con perfil completo
```

### 4. Protección de Rutas

```
Usuario navega a ruta protegida
    ↓
AuthGuard.canActivate()
    ↓
TokenStorageService.isAuthenticated()
    ↓
Verifica token válido y no expirado
    ↓
✅ Permitir acceso / ❌ Redirect a login
```

## 📦 Estructura de Respuesta del API

### 1. Login Endpoint

**Request:** `POST /api/v1/auth/login`

```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": 3,
      "firstName": "Juan",
      "firstLastName": "Pérez",
      "email": "usuario@ejemplo.com"
    }
  },
  "statusCode": 200,
  "message": "Success",
  "timestamp": "2025-10-30T16:17:27.911Z",
  "path": "/api/v1/auth/login"
}
```

### 2. Validate Token Endpoint

**Request:** `POST /api/v1/auth/validate`

Headers: `Authorization: Bearer {token}`

Body: `{}` (vacío)

**Response:**

```json
{
  "data": {
    "valid": true,
    "user": {
      "id": 3,
      "firstName": "Juan",
      "secondName": "Carlos",
      "firstLastName": "Pérez",
      "secondLastName": "García",
      "email": "juan.perez2@ejemplo.com",
      "phoneNumber": "+57 300 123 4568",
      "position": "Psicólogo Clínico",
      "organization": "Centro de Bienestar Familiar",
      "documentNumber": "12345679",
      "address": "Carrera 10 # 15-20",
      "city": "Bogotá",
      "birthDate": "1990-05-13",
      "documentTypeId": 1,
      "status": "ACTIVE",
      "createdAt": "2025-10-29T22:19:40.182Z",
      "updatedAt": "2025-10-29T22:19:40.182Z"
    }
  },
  "statusCode": 201,
  "message": "Success",
  "timestamp": "2025-10-30T16:20:31.194Z",
  "path": "/api/v1/auth/validate"
}
```

## 🔒 Almacenamiento de Datos

### localStorage - Estructura

#### Datos Básicos (después de login)

```typescript
{
  id: number,
  firstName: string,
  firstLastName: string,
  email: string,
  token: string,              // JWT token
  tokenType: string,          // "Bearer"
  expiresAt: Date            // Timestamp de expiración
}
```

#### Datos Completos (después de validate)

```typescript
{
  id: number,
  firstName: string,
  secondName: string | null,
  firstLastName: string,
  secondLastName: string | null,
  email: string,
  phoneNumber: string,
  position: string,
  organization: string,
  documentNumber: string,
  address: string,
  city: string,
  birthDate: string,
  documentTypeId: number,
  status: 'ACTIVE' | 'INACTIVE',
  createdAt: string,
  updatedAt: string,
  token: string,              // JWT token
  tokenType: string,          // "Bearer"
  expiresAt: Date            // Timestamp de expiración
}
```

**Key:** `currentUser`

## 🛡️ Seguridad

### Implementadas

- ✅ JWT almacenado en localStorage
- ✅ Token enviado en header Authorization
- ✅ Validación de expiración de token
- ✅ Logout automático en error 401
- ✅ Limpieza de datos al cerrar sesión
- ✅ HTTPS en producción (recomendado)

### Recomendaciones Adicionales

- 🔄 Implementar refresh token
- 🔄 Agregar timeout de sesión por inactividad
- 🔄 Implementar 2FA (autenticación de dos factores)
- 🔄 Logging de intentos de login fallidos

## 🌐 Configuración de Entornos

### Development

```typescript
// src/environments/environment.ts
export const environment = {
  apiUrl: 'http://localhost:3000/api/v1',
  // ...
};
```

### Production

```typescript
// src/environments/environment.prod.ts
export const environment = {
  apiUrl: 'https://api.ootscolombia.com/api/v1',
  // ...
};
```

## 🌍 Internacionalización

### Claves de Traducción

**Español** (`src/assets/i18n/es.json`):

```json
{
  "auth": {
    "login": {
      "title": "Iniciar Sesión",
      "email": "Correo Electrónico",
      "password": "Contraseña",
      "signIn": "Iniciar Sesión",
      "errors": {
        "invalidCredentials": "Credenciales inválidas...",
        "serverError": "Error en el servidor..."
        // ...
      }
    }
  }
}
```

**Inglés** (`src/assets/i18n/en.json`):

```json
{
  "auth": {
    "login": {
      "title": "Sign In",
      "email": "Email Address",
      "password": "Password",
      "signIn": "Sign In",
      "errors": {
        "invalidCredentials": "Invalid credentials...",
        "serverError": "Server error..."
        // ...
      }
    }
  }
}
```

## 🧪 Testing

### Login Manual

1. Iniciar servidor de desarrollo:

```bash
npm run start:dev
```

2. Navegar a: `http://localhost:4200/auth/login`

3. Ingresar credenciales de prueba:

   - **Email:** `juan.perez2@ejemplo.com`
   - **Password:** `password123`

4. Verificar en DevTools:
   - **Application > Local Storage**: Debe existir `currentUser`
   - **Network > Headers**: Peticiones deben incluir `Authorization: Bearer ...`

### Verificar Token y Datos

```javascript
// En consola del navegador
const user = JSON.parse(localStorage.getItem('currentUser'));
console.log('Token:', user.token);
console.log('Expira:', new Date(user.expiresAt));
console.log('Datos completos:', user);

// Verificar si tiene datos completos
if (user.phoneNumber) {
  console.log('✅ Usuario con datos completos');
  console.log('Posición:', user.position);
  console.log('Organización:', user.organization);
} else {
  console.log('⚠️ Usuario con datos básicos solamente');
}
```

### Probar Validación de Token

1. Hacer login exitosamente
2. Recargar la página (F5)
3. Observar en la consola: "Token validado exitosamente. Usuario completo: {...}"
4. Verificar en Application > Local Storage que ahora tiene todos los campos del usuario

## 🐛 Troubleshooting

### Error: "Could not connect to server"

- ✅ Verificar que el backend esté corriendo en `http://localhost:3000`
- ✅ Revisar CORS en el backend
- ✅ Verificar `environment.apiUrl`

### Error: "Invalid credentials"

- ✅ Verificar email y contraseña correctos
- ✅ Comprobar que el usuario existe en BD
- ✅ Revisar logs del backend

### Token no se agrega a peticiones

- ✅ Verificar que `AuthInterceptor` esté registrado en `app.config.ts`
- ✅ Comprobar que el token existe en localStorage
- ✅ Verificar orden de interceptores

### Redirect loop a login

- ✅ Verificar que `AuthGuard` no proteja la ruta `/auth/login`
- ✅ Comprobar que el token no esté expirado
- ✅ Revisar que el backend retorne 200 en login exitoso

### Error al validar token en app init

- ✅ Verificar que el backend esté corriendo
- ✅ Comprobar que el token en localStorage sea válido
- ✅ El error no impide el funcionamiento, solo registra en consola
- ✅ Revisar endpoint `/auth/validate` en el backend

## 📝 Próximas Mejoras

- [ ] Implementar refresh token automático
- [ ] Agregar remember me funcional
- [ ] Implementar recuperación de contraseña
- [ ] Agregar cambio de contraseña
- [ ] Implementar 2FA
- [ ] Agregar timeout por inactividad
- [ ] Logging de auditoría de accesos
- [ ] Implementar roles y permisos

## 📚 Referencias

- [JWT.io](https://jwt.io/) - JSON Web Tokens
- [Angular HTTP Interceptors](https://angular.io/guide/http-intercept-requests-and-responses)
- [Angular Route Guards](https://angular.io/guide/router#preventing-unauthorized-access)

---

## 🆕 Características Nuevas (v1.1.0)

### Validación Automática de Token

Al iniciar la aplicación, si existe un token en localStorage:

1. Se llama automáticamente a `/api/v1/auth/validate`
2. Se obtienen los datos completos del usuario
3. Se actualizan los datos en localStorage
4. El usuario tiene acceso a su perfil completo sin necesidad de hacer login nuevamente

**Beneficios:**

- ✅ Perfil de usuario actualizado al recargar la página
- ✅ Validación de token en cada inicio
- ✅ Logout automático si el token es inválido
- ✅ Experiencia de usuario mejorada

**Implementación:** `AppComponent.ngOnInit()` → `authService.validateToken()`

---

**Última actualización:** Octubre 30, 2025  
**Versión:** 1.1.0
