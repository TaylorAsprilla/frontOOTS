# Instrucciones para Completar Módulos de Configuración

## Estado Actual

### ✅ Completados

1. **maritalStatus** - Estado Civil
   - ✅ Interfaz (marital-status.interface.ts)
   - ✅ Servicio (marital-status.service.ts)
   - ✅ Rutas (marital-status.routes.ts)
   - ✅ Componente Lista (marital-status-list)
   - ✅ Componente Formulario (marital-status-form)
   - ✅ Integrado en configuration.routes.ts
   - ✅ Integrado en menu-meta.ts

### 🔄 Pendientes

Los siguientes módulos tienen las **carpetas creadas** pero faltan los archivos:

2. **healthInsurance** - EPS (Entidad Promotora de Salud)
3. **familyRelationship** - Parentesco
4. **academicLevel** - Nivel Académico (NOTA: Ya existe pero necesita revisión)
5. **incomeSource** - Fuente de Ingresos
6. **incomeLevel** - Nivel de Ingresos
7. **housingType** - Tipo de Vivienda

## Módulos a Crear

### 2. Health Insurance (EPS)

**Carpetas:** `src/app/pages/configuration/health-insurance/`

**Archivos a crear:**

1. `health-insurance.interface.ts` - Interfaz HealthInsurance
2. `health-insurance.service.ts` - Servicio HTTP
3. `health-insurance.routes.ts` - Rutas
4. `health-insurance-list/health-insurance-list.component.ts`
5. `health-insurance-list/health-insurance-list.component.html`
6. `health-insurance-list/health-insurance-list.component.scss`
7. `health-insurance-form/health-insurance-form.component.ts`
8. `health-insurance-form/health-insurance-form.component.html`
9. `health-insurance-form/health-insurance-form.component.scss`

**Detalles:**

- API Endpoint: `/health-insurance`
- Clase: HealthInsurance / HealthInsurances (plural)
- Icon: 'heart'
- Traducción ES: "EPS" / "EPS"
- Traducción EN: "Health Insurance" / "Health Insurances"

### 3. Family Relationship (Parentesco)

**Carpetas:** `src/app/pages/configuration/family-relationship/`

**Archivos:** Misma estructura (9 archivos)

**Detalles:**

- API Endpoint: `/family-relationship`
- Clase: FamilyRelationship / FamilyRelationships
- Icon: 'users'
- Traducción ES: "Parentesco" / "Parentescos"
- Traducción EN: "Family Relationship" / "Family Relationships"

### 4. Income Source (Fuente de Ingresos)

**Carpetas:** `src/app/pages/configuration/income-source/`

**Archivos:** Misma estructura (9 archivos)

**Detalles:**

- API Endpoint: `/income-source`
- Clase: IncomeSource / IncomeSources
- Icon: 'dollar-sign'
- Traducción ES: "Fuente de Ingresos" / "Fuentes de Ingresos"
- Traducción EN: "Income Source" / "Income Sources"

### 5. Income Level (Nivel de Ingresos)

**Carpetas:** `src/app/pages/configuration/income-level/`

**Archivos:** Misma estructura (9 archivos)

**Detalles:**

- API Endpoint: `/income-level`
- Clase: IncomeLevel / IncomeLevels
- Icon: 'trending-up'
- Traducción ES: "Nivel de Ingresos" / "Niveles de Ingresos"
- Traducción EN: "Income Level" / "Income Levels"

### 6. Housing Type (Tipo de Vivienda)

**Carpetas:** `src/app/pages/configuration/housing-type/`

**Archivos:** Misma estructura (9 archivos)

**Detalles:**

- API Endpoint: `/housing-type`
- Clase: HousingType / HousingTypes
- Icon: 'home'
- Traducción ES: "Tipo de Vivienda" / "Tipos de Vivienda"
- Traducción EN: "Housing Type" / "Housing Types"

## Plantilla Base

Usar **maritalStatus** como plantilla y reemplazar:

### Reemplazos en nombres de archivos:

- `marital-status` → `{module-name}` (kebab-case)
- `MaritalStatus` → `{ModuleName}` (PascalCase)
- `maritalStatus` → `{moduleName}` (camelCase)
- `marital-status` → `{module-name}` (URL/API)

### Ejemplos para healthInsurance:

```typescript
// Interface
export interface HealthInsurance {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Service
private apiUrl = `${environment.apiUrl}/health-insurance`;

// Routes
export const HEALTH_INSURANCE_ROUTES: Routes = [...]

// Component
@Component({
  selector: 'app-health-insurance-list',
  templateUrl: './health-insurance-list.component.html',
})
export class HealthInsuranceListComponent {}
```

## Archivos de Configuración Actualizados

### ✅ configuration.routes.ts

Ya incluye las rutas lazy loading para los 7 módulos

### ✅ menu-meta.ts

Ya incluye las entradas de menú para los 7 módulos

### 🔄 Traducciones Pendientes

#### es.json - Agregar después de "gender":

```json
"familyRelationship": {
  "title": "Parentescos",
  "create": "Crear Parentesco",
  "edit": "Editar Parentesco",
  "delete": "Eliminar Parentesco",
  "view": "Ver Parentesco",
  "list": "Lista de Parentescos",
  "searchPlaceholder": "Buscar parentescos...",
  "filterAll": "Todos los Estados",
  "filterActive": "Activos",
  "filterInactive": "Inactivos",
  "clearFilters": "Limpiar Filtros",
  "noResults": "No se encontraron parentescos",
  "active": "Activo",
  "inactive": "Inactivo",
  "id": "ID",
  "name": "Nombre",
  "status": "Estado",
  "actions": "Acciones",
  "isActive": "Estado Activo",
  "namePlaceholder": "Ej: Padre, Madre, Hermano...",
  "showing": "Mostrando",
  "of": "de",
  "validation": {
    "nameRequired": "El nombre es requerido",
    "nameMinLength": "El nombre debe tener al menos 2 caracteres",
    "nameMaxLength": "El nombre no puede exceder 100 caracteres"
  }
},
"healthInsurance": {
  "title": "EPS",
  "create": "Crear EPS",
  "edit": "Editar EPS",
  "delete": "Eliminar EPS",
  "view": "Ver EPS",
  "list": "Lista de EPS",
  "searchPlaceholder": "Buscar EPS...",
  "filterAll": "Todos los Estados",
  "filterActive": "Activos",
  "filterInactive": "Inactivos",
  "clearFilters": "Limpiar Filtros",
  "noResults": "No se encontraron EPS",
  "active": "Activo",
  "inactive": "Inactivo",
  "id": "ID",
  "name": "Nombre",
  "status": "Estado",
  "actions": "Acciones",
  "isActive": "Estado Activo",
  "namePlaceholder": "Ej: Sura, Sanitas, Compensar...",
  "showing": "Mostrando",
  "of": "de",
  "validation": {
    "nameRequired": "El nombre es requerido",
    "nameMinLength": "El nombre debe tener al menos 2 caracteres",
    "nameMaxLength": "El nombre no puede exceder 100 caracteres"
  }
},
"housingType": {
  "title": "Tipos de Vivienda",
  "create": "Crear Tipo de Vivienda",
  "edit": "Editar Tipo de Vivienda",
  "delete": "Eliminar Tipo de Vivienda",
  "view": "Ver Tipo de Vivienda",
  "list": "Lista de Tipos de Vivienda",
  "searchPlaceholder": "Buscar tipos de vivienda...",
  "filterAll": "Todos los Estados",
  "filterActive": "Activos",
  "filterInactive": "Inactivos",
  "clearFilters": "Limpiar Filtros",
  "noResults": "No se encontraron tipos de vivienda",
  "active": "Activo",
  "inactive": "Inactivo",
  "id": "ID",
  "name": "Nombre",
  "status": "Estado",
  "actions": "Acciones",
  "isActive": "Estado Activo",
  "namePlaceholder": "Ej: Casa propia, Arrendada, Familiar...",
  "showing": "Mostrando",
  "of": "de",
  "validation": {
    "nameRequired": "El nombre es requerido",
    "nameMinLength": "El nombre debe tener al menos 2 caracteres",
    "nameMaxLength": "El nombre no puede exceder 100 caracteres"
  }
},
"incomeLevel": {
  "title": "Niveles de Ingresos",
  "create": "Crear Nivel de Ingresos",
  "edit": "Editar Nivel de Ingresos",
  "delete": "Eliminar Nivel de Ingresos",
  "view": "Ver Nivel de Ingresos",
  "list": "Lista de Niveles de Ingresos",
  "searchPlaceholder": "Buscar niveles de ingresos...",
  "filterAll": "Todos los Estados",
  "filterActive": "Activos",
  "filterInactive": "Inactivos",
  "clearFilters": "Limpiar Filtros",
  "noResults": "No se encontraron niveles de ingresos",
  "active": "Activo",
  "inactive": "Inactivo",
  "id": "ID",
  "name": "Nombre",
  "status": "Estado",
  "actions": "Acciones",
  "isActive": "Estado Activo",
  "namePlaceholder": "Ej: Menos de 1 SMLV, Entre 1-2 SMLV...",
  "showing": "Mostrando",
  "of": "de",
  "validation": {
    "nameRequired": "El nombre es requerido",
    "nameMinLength": "El nombre debe tener al menos 2 caracteres",
    "nameMaxLength": "El nombre no puede exceder 100 caracteres"
  }
},
"incomeSource": {
  "title": "Fuentes de Ingresos",
  "create": "Crear Fuente de Ingresos",
  "edit": "Editar Fuente de Ingresos",
  "delete": "Eliminar Fuente de Ingresos",
  "view": "Ver Fuente de Ingresos",
  "list": "Lista de Fuentes de Ingresos",
  "searchPlaceholder": "Buscar fuentes de ingresos...",
  "filterAll": "Todos los Estados",
  "filterActive": "Activos",
  "filterInactive": "Inactivos",
  "clearFilters": "Limpiar Filtros",
  "noResults": "No se encontraron fuentes de ingresos",
  "active": "Activo",
  "inactive": "Inactivo",
  "id": "ID",
  "name": "Nombre",
  "status": "Estado",
  "actions": "Acciones",
  "isActive": "Estado Activo",
  "namePlaceholder": "Ej: Salario, Pensión, Independiente...",
  "showing": "Mostrando",
  "of": "de",
  "validation": {
    "nameRequired": "El nombre es requerido",
    "nameMinLength": "El nombre debe tener al menos 2 caracteres",
    "nameMaxLength": "El nombre no puede exceder 100 caracteres"
  }
},
"maritalStatus": {
  "title": "Estados Civiles",
  "create": "Crear Estado Civil",
  "edit": "Editar Estado Civil",
  "delete": "Eliminar Estado Civil",
  "view": "Ver Estado Civil",
  "list": "Lista de Estados Civiles",
  "searchPlaceholder": "Buscar estados civiles...",
  "filterAll": "Todos los Estados",
  "filterActive": "Activos",
  "filterInactive": "Inactivos",
  "clearFilters": "Limpiar Filtros",
  "noResults": "No se encontraron estados civiles",
  "active": "Activo",
  "inactive": "Inactivo",
  "id": "ID",
  "name": "Nombre",
  "status": "Estado",
  "actions": "Acciones",
  "isActive": "Estado Activo",
  "namePlaceholder": "Ej: Soltero, Casado, Unión libre...",
  "showing": "Mostrando",
  "of": "de",
  "validation": {
    "nameRequired": "El nombre es requerido",
    "nameMinLength": "El nombre debe tener al menos 2 caracteres",
    "nameMaxLength": "El nombre no puede exceder 100 caracteres"
  }
}
```

#### en.json - Agregar traducciones en inglés equivalentes

## Pasos Siguientes

1. ✅ Crear archivos para healthInsurance (copiar de maritalStatus)
2. ✅ Crear archivos para familyRelationship
3. ✅ Crear archivos para incomeSource
4. ✅ Crear archivos para incomeLevel
5. ✅ Crear archivos para housingType
6. ✅ Actualizar traducciones en es.json y en.json
7. ✅ Verificar compilación sin errores
8. ✅ Probar navegación en el menú
9. ✅ Probar CRUD de cada módulo

## Validación Final

```bash
# Compilar proyecto
ng build --configuration development

# Verificar errores
ng serve

# Probar en navegador:
# - /configuration/marital-status
# - /configuration/health-insurance
# - /configuration/family-relationship
# - /configuration/income-source
# - /configuration/income-level
# - /configuration/housing-type
```

## Notas Importantes

- Todos los módulos siguen el **mismo patrón** que maritalStatus
- Las interfaces tienen los mismos campos: `id, name, isActive, createdAt, updatedAt`
- Los servicios usan **Bearer token** para autenticación
- Los listados tienen **búsqueda local** con debounce de 300ms
- Los filtros son **client-side**: all/active/inactive
- La paginación es **local** con pageSize=10
- Los formularios tienen **validación**: name (required, 2-100 chars)
- Se usa **SweetAlert2** para confirmaciones de eliminación
- Se usa **@if/@for** (sintaxis moderna de Angular 17+)
