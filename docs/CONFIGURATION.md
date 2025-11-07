# Módulos de Configuración

Documentación completa de todos los módulos de configuración del sistema OOTS Colombia.

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura Común](#arquitectura-común)
- [Módulos de Configuración](#módulos-de-configuración)
  - [Niveles Académicos](#niveles-académicos)
  - [Tipos de Consulta](#tipos-de-consulta)
  - [Tipos de Documento](#tipos-de-documento)
  - [Relaciones Familiares](#relaciones-familiares)
  - [Géneros](#géneros)
  - [Seguros de Salud](#seguros-de-salud)
  - [Tipos de Vivienda](#tipos-de-vivienda)
  - [**Situaciones Identificadas**](#situaciones-identificadas)
  - [Niveles de Ingreso](#niveles-de-ingreso)
  - [Fuentes de Ingreso](#fuentes-de-ingreso)
  - [Estados Civiles](#estados-civiles)
- [Menú Desplegable](#menú-desplegable)
- [Traducciones](#traducciones)
- [API Endpoints](#api-endpoints)

---

## Descripción General

Los módulos de configuración son componentes CRUD que permiten gestionar los datos paramétricos del sistema. Todos comparten una arquitectura común y están agrupados bajo un menú desplegable unificado.

### Características Comunes

- Listado con búsqueda, filtros y paginación
- Formulario de creación/edición con validaciones
- Activación/Desactivación de registros
- Eliminación con confirmación
- Internacionalización (ES/EN)
- Lazy loading de componentes

---

## Arquitectura Común

### Estructura de Carpetas

```
src/app/pages/configuration/
├── academic-level/
│   ├── list/
│   │   ├── academic-level-list.component.ts
│   │   ├── academic-level-list.component.html
│   │   └── academic-level-list.component.scss
│   ├── form/
│   │   ├── academic-level-form.component.ts
│   │   ├── academic-level-form.component.html
│   │   └── academic-level-form.component.scss
│   └── academic-level.routes.ts
├── identified-situations/
│   ├── list/
│   ├── form/
│   └── identified-situation.routes.ts
└── ... (otros módulos)
```

### Patrón de Rutas

```typescript
// Ejemplo: identified-situation.routes.ts
import { Routes } from '@angular/router';

export const IDENTIFIED_SITUATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./list/identified-situation-list.component').then((m) => m.IdentifiedSituationListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./form/identified-situation-form.component').then((m) => m.IdentifiedSituationFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./form/identified-situation-form.component').then((m) => m.IdentifiedSituationFormComponent),
  },
];
```

### Patrón de Servicio

```typescript
@Injectable({
  providedIn: 'root',
})
export class IdentifiedSituationService {
  private apiUrl = `${environment.apiUrl}/identified-situations`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<IdentifiedSituation[]> {
    return this.http.get<IdentifiedSituation[]>(this.apiUrl);
  }

  getActive(): Observable<IdentifiedSituation[]> {
    return this.http.get<IdentifiedSituation[]>(`${this.apiUrl}/active`);
  }

  getById(id: number): Observable<IdentifiedSituation> {
    return this.http.get<IdentifiedSituation>(`${this.apiUrl}/${id}`);
  }

  create(data: any): Observable<IdentifiedSituation> {
    return this.http.post<IdentifiedSituation>(this.apiUrl, data);
  }

  update(id: number, data: any): Observable<IdentifiedSituation> {
    return this.http.put<IdentifiedSituation>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleStatus(id: number): Observable<IdentifiedSituation> {
    return this.http.patch<IdentifiedSituation>(`${this.apiUrl}/${id}/toggle-status`, {});
  }
}
```

---

## Módulos de Configuración

### Niveles Académicos

**Descripción:** Gestión de niveles educativos de los participantes.

**Ruta:** `/configuration/academic-level`

**Campos del Formulario:**

- `name`: string (3-100 caracteres, requerido)
- `isActive`: boolean (default: true)

**Ejemplo de Datos:**

```json
[
  { "id": 1, "name": "Primaria", "isActive": true },
  { "id": 2, "name": "Secundaria", "isActive": true },
  { "id": 3, "name": "Técnico", "isActive": true },
  { "id": 4, "name": "Universitario", "isActive": true }
]
```

**API Endpoint:** `/api/academic-levels`

---

### Tipos de Consulta

**Descripción:** Tipos de consulta o abordaje en casos.

**Ruta:** `/configuration/approach-types`

**Campos del Formulario:**

- `name`: string (3-100 caracteres, requerido)
- `isActive`: boolean (default: true)

**Ejemplo de Datos:**

```json
[
  { "id": 1, "name": "Consulta Inicial", "isActive": true },
  { "id": 2, "name": "Seguimiento", "isActive": true },
  { "id": 3, "name": "Consulta Psicológica", "isActive": true }
]
```

**API Endpoint:** `/api/approach-types`

---

### Tipos de Documento

**Descripción:** Tipos de documento de identificación.

**Ruta:** `/configuration/document-types`

**Campos del Formulario:**

- `name`: string (3-100 caracteres, requerido)
- `isActive`: boolean (default: true)

**Ejemplo de Datos:**

```json
[
  { "id": 1, "name": "Cédula de Ciudadanía", "isActive": true },
  { "id": 2, "name": "Tarjeta de Identidad", "isActive": true },
  { "id": 3, "name": "Pasaporte", "isActive": true },
  { "id": 4, "name": "Cédula de Extranjería", "isActive": true }
]
```

**API Endpoint:** `/api/document-types`

---

### Relaciones Familiares

**Descripción:** Tipos de relaciones familiares entre participantes.

**Ruta:** `/configuration/family-relationship`

**Campos del Formulario:**

- `name`: string (3-100 caracteres, requerido)
- `isActive`: boolean (default: true)

**Ejemplo de Datos:**

```json
[
  { "id": 1, "name": "Padre/Madre", "isActive": true },
  { "id": 2, "name": "Hijo/Hija", "isActive": true },
  { "id": 3, "name": "Hermano/Hermana", "isActive": true },
  { "id": 4, "name": "Abuelo/Abuela", "isActive": true },
  { "id": 5, "name": "Cónyuge", "isActive": true }
]
```

**API Endpoint:** `/api/family-relationships`

---

### Géneros

**Descripción:** Identidades de género disponibles en el sistema.

**Ruta:** `/configuration/genders`

**Campos del Formulario:**

- `name`: string (3-50 caracteres, requerido)
- `isActive`: boolean (default: true)

**Ejemplo de Datos:**

```json
[
  { "id": 1, "name": "Masculino", "isActive": true },
  { "id": 2, "name": "Femenino", "isActive": true },
  { "id": 3, "name": "No Binario", "isActive": true },
  { "id": 4, "name": "Prefiero no decir", "isActive": true }
]
```

**API Endpoint:** `/api/genders`

---

### Seguros de Salud

**Descripción:** Tipos de aseguramiento en salud.

**Ruta:** `/configuration/health-insurance`

**Campos del Formulario:**

- `name`: string (3-100 caracteres, requerido)
- `isActive`: boolean (default: true)

**Ejemplo de Datos:**

```json
[
  { "id": 1, "name": "Contributivo", "isActive": true },
  { "id": 2, "name": "Subsidiado", "isActive": true },
  { "id": 3, "name": "Especial", "isActive": true },
  { "id": 4, "name": "No Asegurado", "isActive": true }
]
```

**API Endpoint:** `/api/health-insurances`

---

### Tipos de Vivienda

**Descripción:** Tipos de vivienda de los participantes.

**Ruta:** `/configuration/housing-type`

**Campos del Formulario:**

- `name`: string (3-100 caracteres, requerido)
- `isActive`: boolean (default: true)

**Ejemplo de Datos:**

```json
[
  { "id": 1, "name": "Casa Propia", "isActive": true },
  { "id": 2, "name": "Casa Arrendada", "isActive": true },
  { "id": 3, "name": "Casa Familiar", "isActive": true },
  { "id": 4, "name": "Apartamento", "isActive": true }
]
```

**API Endpoint:** `/api/housing-types`

---

### Situaciones Identificadas

**Descripción:** Situaciones psicosociales identificadas en la evaluación de casos. Este módulo permite seleccionar múltiples situaciones en el formulario de creación de casos mediante checkboxes.

**Ruta:** `/configuration/identified-situations`

**Campos del Formulario:**

- `name`: string (3-200 caracteres, requerido)
- `isActive`: boolean (default: true)

**Ejemplo de Datos:**

```json
[
  { "id": 1, "name": "Depresión", "isActive": true },
  { "id": 2, "name": "Violencia Intrafamiliar", "isActive": true },
  { "id": 3, "name": "Problemas de Aprendizaje", "isActive": true },
  { "id": 4, "name": "Consumo de Sustancias", "isActive": true },
  { "id": 5, "name": "Ansiedad", "isActive": true }
]
```

**API Endpoint:** `/api/identified-situations`

#### Uso en Formulario de Casos

Las situaciones identificadas se muestran como checkboxes en el paso 2 del wizard de creación de casos:

```typescript
// create-case.component.ts
export class CreateCaseComponent implements OnInit {
  identifiedSituations: IdentifiedSituation[] = [];

  constructor(private identifiedSituationService: IdentifiedSituationService) {}

  ngOnInit() {
    this.loadIdentifiedSituations();
  }

  loadIdentifiedSituations(): void {
    this.identifiedSituationService
      .getActive()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (situations) => {
          this.identifiedSituations = situations;
        },
        error: (error) => {
          console.error('Error loading situations:', error);
        },
      });
  }

  onSituationChange(event: Event, situationId: number): void {
    const checkbox = event.target as HTMLInputElement;
    const situationsControl = this.caseForm.get('identifiedSituations.situations');
    const situations = situationsControl?.value || [];

    if (checkbox.checked) {
      situations.push(situationId);
    } else {
      const index = situations.indexOf(situationId);
      if (index > -1) {
        situations.splice(index, 1);
      }
    }

    situationsControl?.setValue(situations);
  }

  isSituationSelected(situationId: number): boolean {
    const situations = this.caseForm.get('identifiedSituations.situations')?.value;
    return situations ? situations.includes(situationId) : false;
  }
}
```

```html
<!-- create-case.component.html - Step 2 -->
<div class="row">
  @for (situation of identifiedSituations; track situation.id) {
  <div class="col-md-6 col-lg-4 mb-2">
    <div class="form-check">
      <input
        type="checkbox"
        class="form-check-input"
        [id]="'situation-' + situation.id"
        [checked]="isSituationSelected(situation.id)"
        (change)="onSituationChange($event, situation.id)"
      />
      <label class="form-check-label" [for]="'situation-' + situation.id"> {{ situation.name }} </label>
    </div>
  </div>
  }
</div>
```

**Características Especiales:**

- Se carga dinámicamente desde API (solo registros activos)
- Permite selección múltiple mediante checkboxes
- Grid responsive de 3 columnas (col-md-6 col-lg-4)
- Validación: al menos una situación debe seleccionarse
- Integración con FormArray en el formulario principal

---

### Niveles de Ingreso

**Descripción:** Rangos de ingresos económicos.

**Ruta:** `/configuration/income-level`

**Campos del Formulario:**

- `name`: string (3-100 caracteres, requerido)
- `isActive`: boolean (default: true)

**Ejemplo de Datos:**

```json
[
  { "id": 1, "name": "Menos de 1 SMLV", "isActive": true },
  { "id": 2, "name": "1-2 SMLV", "isActive": true },
  { "id": 3, "name": "2-3 SMLV", "isActive": true },
  { "id": 4, "name": "Más de 3 SMLV", "isActive": true }
]
```

**API Endpoint:** `/api/income-levels`

---

### Fuentes de Ingreso

**Descripción:** Fuentes de ingresos económicos de los participantes.

**Ruta:** `/configuration/income-source`

**Campos del Formulario:**

- `name`: string (3-100 caracteres, requerido)
- `isActive`: boolean (default: true)

**Ejemplo de Datos:**

```json
[
  { "id": 1, "name": "Trabajo Dependiente", "isActive": true },
  { "id": 2, "name": "Trabajo Independiente", "isActive": true },
  { "id": 3, "name": "Pensión", "isActive": true },
  { "id": 4, "name": "Subsidios Estatales", "isActive": true }
]
```

**API Endpoint:** `/api/income-sources`

---

### Estados Civiles

**Descripción:** Estados civiles de los participantes.

**Ruta:** `/configuration/marital-status`

**Campos del Formulario:**

- `name`: string (3-50 caracteres, requerido)
- `isActive`: boolean (default: true)

**Ejemplo de Datos:**

```json
[
  { "id": 1, "name": "Soltero/a", "isActive": true },
  { "id": 2, "name": "Casado/a", "isActive": true },
  { "id": 3, "name": "Unión Libre", "isActive": true },
  { "id": 4, "name": "Divorciado/a", "isActive": true },
  { "id": 5, "name": "Viudo/a", "isActive": true }
]
```

**API Endpoint:** `/api/marital-statuses`

---

## Menú Desplegable

Todos los módulos de configuración están agrupados en un menú desplegable único en la navegación lateral:

```typescript
// menu-meta.ts
{
  key: 'configuration-management',
  label: 'configuration.title', // "Configuración"
  icon: 'settings',
  collapsed: true,
  children: [
    {
      key: 'configuration-academic-level',
      label: 'academicLevel.title',
      link: '/configuration/academic-level',
      parentKey: 'configuration-management'
    },
    {
      key: 'configuration-approach-types',
      label: 'approachType.title',
      link: '/configuration/approach-types',
      parentKey: 'configuration-management'
    },
    {
      key: 'configuration-document-types',
      label: 'documentType.title',
      link: '/configuration/document-types',
      parentKey: 'configuration-management'
    },
    {
      key: 'configuration-family-relationship',
      label: 'familyRelationship.title',
      link: '/configuration/family-relationship',
      parentKey: 'configuration-management'
    },
    {
      key: 'configuration-genders',
      label: 'gender.title',
      link: '/configuration/genders',
      parentKey: 'configuration-management'
    },
    {
      key: 'configuration-health-insurance',
      label: 'healthInsurance.title',
      link: '/configuration/health-insurance',
      parentKey: 'configuration-management'
    },
    {
      key: 'configuration-housing-type',
      label: 'housingType.title',
      link: '/configuration/housing-type',
      parentKey: 'configuration-management'
    },
    {
      key: 'configuration-identified-situations',
      label: 'identifiedSituation.title',
      link: '/configuration/identified-situations',
      parentKey: 'configuration-management'
    },
    {
      key: 'configuration-income-level',
      label: 'incomeLevel.title',
      link: '/configuration/income-level',
      parentKey: 'configuration-management'
    },
    {
      key: 'configuration-income-source',
      label: 'incomeSource.title',
      link: '/configuration/income-source',
      parentKey: 'configuration-management'
    },
    {
      key: 'configuration-marital-status',
      label: 'maritalStatus.title',
      link: '/configuration/marital-status',
      parentKey: 'configuration-management'
    }
  ]
}
```

**Características:**

- Menú colapsable (`collapsed: true`)
- 11 sub-items con enlaces directos
- Relación padre-hijo mediante `parentKey`
- Totalmente internacionalizado

---

## Traducciones

### Español (es.json)

```json
{
  "configuration": {
    "title": "Configuración"
  },
  "identifiedSituation": {
    "title": "Situaciones Identificadas",
    "create": "Crear Situación",
    "edit": "Editar Situación",
    "list": "Lista de Situaciones Identificadas",
    "namePlaceholder": "Ej: Depresión, Violencia en el hogar...",
    "validation": {
      "nameRequired": "El nombre es requerido",
      "nameMinLength": "El nombre debe tener al menos 3 caracteres",
      "nameMaxLength": "El nombre no puede exceder 200 caracteres"
    }
  },
  "academicLevel": {
    "title": "Niveles Académicos",
    "create": "Crear Nivel Académico",
    "edit": "Editar Nivel Académico"
  }
  // ... otros módulos
}
```

### English (en.json)

```json
{
  "configuration": {
    "title": "Configuration"
  },
  "identifiedSituation": {
    "title": "Identified Situations",
    "create": "Create Situation",
    "edit": "Edit Situation",
    "list": "Identified Situations List",
    "namePlaceholder": "E.g: Depression, Domestic violence...",
    "validation": {
      "nameRequired": "Name is required",
      "nameMinLength": "Name must be at least 3 characters",
      "nameMaxLength": "Name cannot exceed 200 characters"
    }
  },
  "academicLevel": {
    "title": "Academic Levels",
    "create": "Create Academic Level",
    "edit": "Edit Academic Level"
  }
  // ... other modules
}
```

---

## API Endpoints

### Base URL

```
http://localhost:8080/api
```

### Endpoints Comunes para Todos los Módulos

| Método | Endpoint                           | Descripción                    |
| ------ | ---------------------------------- | ------------------------------ |
| GET    | `/api/{module}`                    | Obtener todos los registros    |
| GET    | `/api/{module}/active`             | Obtener solo registros activos |
| GET    | `/api/{module}/{id}`               | Obtener registro por ID        |
| POST   | `/api/{module}`                    | Crear nuevo registro           |
| PUT    | `/api/{module}/{id}`               | Actualizar registro            |
| DELETE | `/api/{module}/{id}`               | Eliminar registro              |
| PATCH  | `/api/{module}/{id}/toggle-status` | Cambiar estado activo/inactivo |

### Ejemplo de Petición

**Crear Situación Identificada:**

```http
POST /api/identified-situations
Content-Type: application/json

{
  "name": "Depresión",
  "isActive": true
}
```

**Respuesta:**

```json
{
  "id": 1,
  "name": "Depresión",
  "isActive": true,
  "createdAt": "2025-11-15T10:30:00Z",
  "updatedAt": "2025-11-15T10:30:00Z"
}
```

---

## Componente de Lista - Características

### Funcionalidades

- **Búsqueda:** Campo de texto con debounce de 300ms
- **Filtro por Estado:** Dropdown (Todos/Activos/Inactivos)
- **Ordenamiento:** Por ID o Nombre (ascendente/descendente)
- **Paginación:** 10 registros por página
- **Acciones:**
  - Ver
  - Editar (navega al formulario)
  - Eliminar (confirmación con SweetAlert2)
  - Cambiar Estado (confirmación)

### Ejemplo de Implementación

```typescript
export class IdentifiedSituationListComponent implements OnInit {
  situations: IdentifiedSituation[] = [];
  filteredSituations: IdentifiedSituation[] = [];
  paginatedSituations: IdentifiedSituation[] = [];

  // Filtros
  searchTerm: string = '';
  statusFilter: string = 'all';
  sortField: string = 'id';
  sortOrder: string = 'asc';

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  ngOnInit() {
    this.loadSituations();
  }

  loadSituations(): void {
    this.service.getAll().subscribe({
      next: (data) => {
        this.situations = data;
        this.applyFilters();
      },
    });
  }

  applyFilters(): void {
    let filtered = [...this.situations];

    // Búsqueda
    if (this.searchTerm) {
      filtered = filtered.filter((s) => s.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }

    // Filtro por estado
    if (this.statusFilter !== 'all') {
      const isActive = this.statusFilter === 'active';
      filtered = filtered.filter((s) => s.isActive === isActive);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      const aValue = a[this.sortField];
      const bValue = b[this.sortField];
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredSituations = filtered;
    this.totalItems = filtered.length;
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedSituations = this.filteredSituations.slice(startIndex, endIndex);
  }
}
```

---

## Componente de Formulario - Características

### Funcionalidades

- **Modo Dual:** Crear/Editar (detecta por presencia de ID en ruta)
- **Validaciones:** Validators de Angular
- **Breadcrumbs Dinámicos:** Cambian según modo
- **Mensajes de Error:** Traducidos y específicos
- **Notificaciones:** Toast para éxito/error

### Ejemplo de Implementación

```typescript
export class IdentifiedSituationFormComponent implements OnInit {
  situationForm: FormGroup;
  isEditMode = false;
  situationId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: IdentifiedSituationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.situationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      isActive: [true],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.situationId = +id;
      this.loadSituation();
    }
  }

  loadSituation(): void {
    if (this.situationId) {
      this.service.getById(this.situationId).subscribe({
        next: (situation) => {
          this.situationForm.patchValue(situation);
        },
      });
    }
  }

  onSubmit(): void {
    if (this.situationForm.valid) {
      const data = this.situationForm.value;

      const request =
        this.isEditMode && this.situationId ? this.service.update(this.situationId, data) : this.service.create(data);

      request.subscribe({
        next: () => {
          // Notificación de éxito
          this.router.navigate(['/configuration/identified-situations']);
        },
        error: (error) => {
          // Notificación de error
        },
      });
    }
  }
}
```

---

## Troubleshooting

### Problema: Situaciones no se cargan en el formulario de casos

**Solución:**

1. Verificar que el servicio esté inyectado correctamente
2. Verificar que `loadIdentifiedSituations()` se llame en `ngOnInit`
3. Verificar que la API esté respondiendo correctamente:
   ```bash
   curl http://localhost:8080/api/identified-situations/active
   ```

### Problema: Menú desplegable no funciona

**Solución:**

1. Verificar que `collapsed: true` esté configurado
2. Verificar que todos los children tengan `parentKey: 'configuration-management'`
3. Verificar que las traducciones existan para todas las etiquetas

### Problema: Validaciones no se muestran

**Solución:**

1. Verificar que los Validators estén en el FormControl
2. Verificar que las traducciones de errores existan
3. Verificar que el HTML tenga los bloques de error con `@if`

---

## Referencias

- [Sistema de Autenticación](AUTH_SYSTEM.md)
- [Acciones de Tabla](TABLE_ACTIONS.md)
- [README Principal](../README.md)

---

<div align="center">

**Documentación actualizada:** Noviembre 2025  
**Versión:** 1.1.0

</div>
