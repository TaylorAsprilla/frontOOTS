# Documentación: Acciones de Tabla con Botones HTML Dinámicos

## Problema

Los botones de acción en la tabla de usuarios (Ver, Editar, Eliminar) se generan dinámicamente mediante HTML inyectado con `innerHTML`. Los eventos `onclick` no funcionan directamente en Angular debido a las restricciones de seguridad del framework.

## Solución Implementada

### 1. Exponer Métodos Globalmente

Los métodos del componente se exponen en el objeto `window` para que puedan ser accedidos desde el HTML inyectado:

```typescript
ngOnInit(): void {
  // Exponer métodos globalmente para los botones de la tabla
  (window as any).viewUserDetails = (id: number) => this.viewUserDetails(id);
  (window as any).editUser = (id: number) => this.navigateToEdit(id);
  (window as any).deleteUser = (id: number) => this.confirmDeleteUser(id);
}
```

### 2. Mantener Referencias con ngAfterViewChecked

Para asegurar que las referencias globales persistan después de actualizaciones de la vista:

```typescript
ngAfterViewChecked(): void {
  // Re-exponer los métodos después de cada actualización de la vista
  if (!(window as any).viewUserDetails) {
    (window as any).viewUserDetails = (id: number) => this.viewUserDetails(id);
    (window as any).editUser = (id: number) => this.navigateToEdit(id);
    (window as any).deleteUser = (id: number) => this.confirmDeleteUser(id);
  }
}
```

### 3. Limpiar Referencias en ngOnDestroy

Para evitar memory leaks:

```typescript
ngOnDestroy(): void {
  // Limpiar referencias globales
  delete (window as any).viewUserDetails;
  delete (window as any).editUser;
  delete (window as any).deleteUser;

  this.destroy$.next();
  this.destroy$.complete();
}
```

### 4. Formatter de Columna con onclick

```typescript
{
  name: 'actions',
  label: 'Acciones',
  formatter: (record: UserInterface) => {
    return `
      <button
        class="btn btn-sm btn-info me-1"
        onclick="window.viewUserDetails(${record.id})"
        title="Ver información"
      >
        <i class="mdi mdi-eye"></i>
      </button>
      <button
        class="btn btn-sm btn-primary me-1"
        onclick="window.editUser(${record.id})"
        title="Editar"
      >
        <i class="mdi mdi-pencil"></i>
      </button>
      <button
        class="btn btn-sm btn-danger"
        onclick="window.deleteUser(${record.id})"
        title="Eliminar"
      >
        <i class="mdi mdi-delete"></i>
      </button>
    `;
  },
  width: 140,
  sort: false,
}
```

## Funcionalidades de los Botones

### 🔵 Botón Info (Ver información)

- **Color**: Info (azul claro)
- **Icono**: `mdi-eye`
- **Acción**: Abre modal con información detallada del usuario
- **Método**: `viewUserDetails(userId: number)`
- **Características**:
  - Carga datos desde API: `GET /users/:id`
  - Muestra información personal, contacto, profesional y sistema
  - Modal responsive con diseño en tarjetas
  - Loading state mientras carga

### 🟢 Botón Editar

- **Color**: Primary (azul)
- **Icono**: `mdi-pencil`
- **Acción**: Navega a la página de edición del usuario
- **Método**: `navigateToEdit(userId: number)`
- **Ruta**: `/user-management/edit/:id`

### 🔴 Botón Eliminar

- **Color**: Danger (rojo)
- **Icono**: `mdi-delete`
- **Acción**: Elimina el usuario después de confirmación
- **Método**: `confirmDeleteUser(userId: number)`
- **Características**:
  - Muestra diálogo de confirmación con SweetAlert2
  - Incluye nombre del usuario en el mensaje
  - Llama a API: `DELETE /users/:id`
  - Actualiza la tabla después de eliminar
  - Maneja errores específicos (404, 409)

## Flujo de Eliminación

```
1. Usuario hace click en botón eliminar
   ↓
2. window.deleteUser(id) → confirmDeleteUser(id)
   ↓
3. Busca nombre del usuario en records
   ↓
4. Muestra SweetAlert2 de confirmación
   ↓
5. Si confirma → deleteUser(id) privado
   ↓
6. Llamada a userService.deleteUser(id)
   ↓
7. Success: Notificación + Recargar tabla
   Error: Notificación específica del error
```

## Consideraciones de Seguridad

### ✅ Ventajas

- Funcionamiento garantizado con innerHTML
- Compatibilidad con table component existente
- No requiere refactorización del componente de tabla

### ⚠️ Desventajas

- Uso del objeto global `window`
- Posible conflicto si hay múltiples componentes usando mismo patrón

### 🔒 Mejoras Futuras

Para una solución más robusta, considerar:

1. **Event Delegation**: Usar un listener único en el contenedor de la tabla
2. **Custom Component**: Crear un componente especializado para la columna de acciones
3. **Emitters**: Modificar AdvancedTableComponent para emitir eventos de acción
4. **Renderer2**: Usar Angular Renderer2 para agregar listeners dinámicamente

## Testing

### Probar en Browser Console

```javascript
// Verificar que los métodos están expuestos
console.log(typeof window.viewUserDetails); // debe retornar "function"
console.log(typeof window.editUser); // debe retornar "function"
console.log(typeof window.deleteUser); // debe retornar "function"

// Probar llamada directa
window.viewUserDetails(1); // Debe abrir modal del usuario con ID 1
```

### Casos de Prueba

1. ✅ Click en botón Info → Modal se abre con datos del usuario
2. ✅ Click en botón Editar → Navega a página de edición
3. ✅ Click en botón Eliminar → Muestra confirmación
4. ✅ Confirmar eliminación → Usuario se elimina y tabla se actualiza
5. ✅ Cancelar eliminación → No se elimina nada
6. ✅ Error de API → Muestra mensaje de error apropiado

## API Endpoints Utilizados

### GET /users/:id

Obtiene información completa de un usuario específico.

**Response:**

```json
{
  "data": {
    "id": 1,
    "firstName": "John",
    "secondName": "Michael",
    "firstLastName": "Doe",
    "secondLastName": "Smith",
    "email": "john.doe@example.com",
    "phoneNumber": "3001234567",
    "documentNumber": "1234567890",
    "address": "123 Main St",
    "city": "Bogotá",
    "birthDate": "1990-01-01",
    "position": "Developer",
    "organization": "Tech Company",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "statusCode": 200,
  "message": "User found successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### DELETE /users/:id

Elimina un usuario del sistema.

**Response Success:**

```json
{
  "statusCode": 200,
  "message": "User deleted successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Response Error 409:**

```json
{
  "statusCode": 409,
  "message": "Cannot delete user with associated records",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Versión

- **Implementado**: 2025-01-30
- **Angular**: 20.1.6
- **Componente**: `UsersComponent`
- **Estado**: ✅ Funcional y probado
