# Recomendaciones de Traducción para OOTS

## Resumen Ejecutivo

Este documento identifica todos los textos hardcodeados que necesitan ser traducidos usando Transloco en todo el proyecto.

## Estado Actual

- **Archivos de idioma existentes:**

  - `es-CO.json` (Colombia) - 1046 líneas
  - `es-PR.json` (Puerto Rico) - Similar a es-CO
  - `en.json` (English) - 994 líneas

- **Sistema de traducción:** Transloco (migrando desde Angular i18n)

## Claves de Traducción Faltantes

### 1. Traducciones Globales Comunes

Agregar a la sección `app`:

```json
{
  "app": {
    "select": "Seleccione",
    "pleaseSelect": "Por favor seleccione",
    "all": "Todos",
    "active": "Activo",
    "inactive": "Inactivo",
    "name": "Nombre",
    "description": "Descripción",
    "date": "Fecha",
    "status": "Estado",
    "optional": "Opcional",
    "yesNo": "Sí/No",
    "zipCode": "Código Postal",
    "entries": "Entradas",
    "selectCountry": "Seleccionar País"
  }
}
```

### 2. Traducciones de Participantes (Ampliar)

Agregar a la sección `participants`:

```json
{
  "participants": {
    "enterHealthInsuranceName": "Ingrese el nombre de la EPS",
    "removeFamilyMember": "Eliminar familiar",
    "noFamilyMembersAdded": "No hay miembros familiares agregados",
    "selectRelationship": "Seleccione el Parentesco",
    "selectAcademicLevel": "Seleccione el Grado Académico",
    "institutionPlaceholder": "Ej: Universidad Nacional",
    "completedGradePlaceholder": "Ej: Profesional Completo",
    "professionPlaceholder": "Ej: Psicóloga Clínica",
    "occupationalHistoryPlaceholder": "Ej: 5 años como psicóloga clínica...",
    "housingDescription": "Descripción de la vivienda",
    "housingPlaceholder": "Ej: Casa propia de 2 pisos...",
    "documentAlreadyExists": "El número de documento {{number}} ya está registrado"
  }
}
```

### 3. Traducciones de Casos

Agregar nueva sección `cases`:

```json
{
  "cases": {
    "consultationReasonPlaceholder": "Describa el motivo de la consulta...",
    "selectIdentifiedSituations": "Seleccione las Situaciones Identificadas",
    "interventionPlaceholder": "Describa la intervención realizada...",
    "selectActions": "Seleccione las acciones realizadas",
    "optionalField": "Campo opcional para información",
    "addPhysicalCondition": "Agregar Condición Física",
    "currentlyReceivingTreatment": "¿Actualmente recibe algún tipo de tratamiento?",
    "physicalConditionPlaceholder": "Ej: Diabetes, Hipertensión...",
    "treatmentDetailsPlaceholder": "Detalles del tratamiento...",
    "paternalHistoryPlaceholder": "Historial paterno...",
    "maternalHistoryPlaceholder": "Historial materno...",
    "additionalObservationsPlaceholder": "Observaciones adicionales...",
    "removeCondition": "Eliminar condición",
    "noPhysicalConditions": "No se han agregado condiciones físicas. Haga clic en 'Agregar Condición Física'",
    "addMentalCondition": "Agregar Condición Mental",
    "mentalConditionPlaceholder": "Ej: Depresión, Ansiedad, Bipolaridad...",
    "medicationTherapyPlaceholder": "Medicamentos y/o terapia...",
    "noMentalConditions": "No se han agregado condiciones mentales. Haga clic en 'Agregar Condición Mental'",
    "consultationReasonDescription": "DESCRIPCIÓN GENERAL DEL MOTIVO DE CONSULTA",
    "detailedDescriptionPlaceholder": "Describa de manera detallada...",
    "facilitatingFactorsPlaceholder": "Factores positivos...",
    "hinderingFactorsPlaceholder": "Obstáculos identificados...",
    "theoreticalFrameworkPlaceholder": "Marco teórico de referencia...",
    "addIntervention": "Agregar Intervención",
    "noInterventions": "No hay intervenciones agregadas",
    "goalsPlaceholder": "Metas a alcanzar...",
    "objectivesPlaceholder": "Objetivos específicos...",
    "activitiesPlaceholder": "Actividades o técnicas...",
    "timeframePlaceholder": "Ej: 3 meses",
    "responsiblePersonPlaceholder": "Nombre del responsable",
    "evaluationCriteriaPlaceholder": "Criterios para evaluar...",
    "removeIntervention": "Eliminar intervención",
    "interventionNote": "Nota: Cada intervención debe incluir metas",
    "addProgressNote": "Agregar Nota de Progreso",
    "noProgressNotes": "No hay notas de progreso agregadas",
    "approachTypePlaceholder": "Ej: Individual, Familiar, Grupal...",
    "processDescriptionPlaceholder": "Descripción del proceso...",
    "interventionSummaryPlaceholder": "Resumen de la intervención...",
    "observationsPlaceholder": "Observaciones...",
    "agreementsPlaceholder": "Acuerdos establecidos...",
    "removeNote": "Eliminar nota",
    "progressNotesNote": "Nota: Registre cada intervención de manera cronológica",
    "referralsDescription": "Descripción de los Referidos y su Justificación",
    "referralsPlaceholder": "Describa los referidos...",
    "referralsNote": "Sea específico con el nombre de la institución",
    "closingNoteInstruction": "Complete esta sección solo si está cerrando el caso",
    "closingDate": "Fecha de cierre",
    "closingReasonPlaceholder": "Describa el motivo del cierre...",
    "achievementsPlaceholder": "Enumere los logros alcanzados...",
    "recommendationsPlaceholder": "Recomendaciones para el participante...",
    "followUpPlaceholder": "Sugerencias de seguimiento..."
  }
}
```

### 4. Traducciones de Tablas

Agregar nueva sección `table`:

```json
{
  "table": {
    "show": "Mostrar",
    "showingEntries": "Mostrando {{start}} a {{end}} de {{total}} entradas"
  }
}
```

### 5. Traducciones de Calendario

Agregar nueva sección `calendar`:

```json
{
  "calendar": {
    "eventDescriptionPlaceholder": "Descripción de la cita",
    "selectCategory": "Seleccione la categoría"
  }
}
```

### 6. Traducciones de Validación

Agregar a la sección `validation` (o crear si no existe):

```json
{
  "validation": {
    "fieldRequired": "Este campo es requerido",
    "descriptionRequired": "La descripción es requerida"
  }
}
```

### 7. Actualizar Sección de Dashboard

El dashboard actualmente usa Angular i18n (atributo `i18n`). Migrar a Transloco:

**Cambios necesarios en `dashboard-one.component.html`:**

```html
<!-- ANTES -->
<h4 class="page-title" i18n>Inicio</h4>

<!-- DESPUÉS -->
<h4 class="page-title">{{ 'dashboard.home' | transloco }}</h4>
```

```html
<!-- ANTES -->
<a href="javascript:void(0);" ngbDropdownItem i18n>Sales Report</a>

<!-- DESPUÉS -->
<a href="javascript:void(0);" ngbDropdownItem>{{ 'dashboard.salesReport' | transloco }}</a>
```

Agregar claves faltantes:

```json
{
  "dashboard": {
    "home": "Inicio",
    "salesReport": "Reporte de Ventas",
    "exportReport": "Exportar Reporte",
    "profit": "Ganancias",
    "action": "Acción",
    "editReport": "Editar Reporte",
    "loading": "Cargando estadísticas..."
  }
}
```

### 8. Traducciones de Configuración - Módulos Específicos

Para cada módulo de configuración, asegurar que existen estas claves:

```json
{
  "housingType": {
    "addNew": "Nuevo Tipo de Vivienda",
    "notFound": "No se encontraron tipos de vivienda"
  },
  "maritalStatus": {
    "addNew": "Nuevo Estado Civil",
    "notFound": "No se encontraron estados civiles"
  },
  "incomeSource": {
    "addNew": "Nueva Fuente de Ingresos",
    "notFound": "No se encontraron fuentes de ingresos"
  },
  "incomeLevel": {
    "addNew": "Nuevo Nivel de Ingresos",
    "notFound": "No se encontraron niveles de ingresos"
  },
  "healthInsurance": {
    "addNew": "Nueva EPS",
    "notFound": "No se encontraron eps"
  },
  "gender": {
    "addNew": "Nuevo Género",
    "notFound": "No se encontraron géneros"
  },
  "familyRelationship": {
    "addNew": "Nuevo Parentesco",
    "notFound": "No se encontraron parentescos"
  },
  "identifiedSituation": {
    "addNew": "Nueva Situación Identificada",
    "notFound": "No se encontraron situaciones identificadas"
  }
}
```

## Acciones Requeridas

### Prioridad Alta (Impacto Visual Inmediato)

1. **Migrar Angular i18n a Transloco en dashboard-one.component.html**

   - Reemplazar todos los atributos `i18n` y `i18n="@@id"` con pipes `{{ | transloco }}`
   - Archivo: `src/app/pages/dashboard/dashboard-one/dashboard-one.component.html`

2. **Agregar traducciones faltantes en formularios**

   - create-participant.component.html
   - create-case.component.html
   - Todos los archivos de configuración

3. **Estandarizar textos de botones comunes**
   - "Seleccione", "Agregar", "Eliminar", "Editar", "Cancelar"
   - Usar claves compartidas desde `app.*` o `common.*`

### Prioridad Media

4. **Completar traducciones de casos**

   - Agregar todas las claves de `cases` al archivo JSON
   - Actualizar templates para usar las nuevas claves

5. **Agregar traducciones de tablas**
   - advanced-table component
   - Texto "Mostrando X a Y de Z entradas"

### Prioridad Baja

6. **Revisar y estandarizar placeholders**

   - Asegurar consistencia en ejemplos de placeholders
   - Usar formato coherente: "Ej: ...", "Ingrese...", "Seleccione..."

7. **Documentar convenciones de nomenclatura**
   - Estructura de claves: `{module}.{action}.{element}`
   - Ejemplos: `participants.create.title`, `cases.edit.saveButton`

## Patrón de Migración Recomendado

### Para textos hardcodeados en HTML:

```html
<!-- ANTES -->
<button>Guardar</button>

<!-- DESPUÉS -->
<button>{{ 'app.save' | transloco }}</button>
```

### Para atributos i18n de Angular:

```html
<!-- ANTES -->
<label i18n="@@fieldName">Nombre</label>

<!-- DESPUÉS -->
<label>{{ 'app.name' | transloco }}</label>
```

### Para textos con interpolación:

```html
<!-- ANTES -->
<p>Mostrando {{ start }} a {{ end }} de {{ total }} entradas</p>

<!-- DESPUÉS -->
<p>{{ 'table.showingEntries' | transloco: { start: start, end: end, total: total } }}</p>
```

## Checklist de Implementación

- [ ] Agregar todas las claves faltantes a es-CO.json
- [ ] Agregar todas las claves faltantes a es-PR.json
- [ ] Agregar todas las claves faltantes a en.json
- [ ] Migrar dashboard-one.component.html de i18n a transloco
- [ ] Actualizar create-participant.component.html
- [ ] Actualizar create-case.component.html
- [ ] Actualizar todos los módulos de configuración
- [ ] Actualizar advanced-table.component.html
- [ ] Actualizar calendar.component.html
- [ ] Probar cada idioma (es-CO, es-PR, en)
- [ ] Verificar que no queden textos hardcodeados

## Notas Importantes

1. **Consistencia**: Usar las mismas claves para conceptos similares en diferentes módulos
2. **Reutilización**: Preferir claves globales (`app.*`, `common.*`) para términos frecuentes
3. **Claridad**: Nombres de claves descriptivos que indiquen su uso
4. **Mantenibilidad**: Agrupar claves por módulo/funcionalidad
5. **Testing**: Probar cada cambio en todos los idiomas disponibles

## Archivos Principales a Actualizar

1. `src/assets/i18n/es-CO.json`
2. `src/assets/i18n/es-PR.json`
3. `src/assets/i18n/en.json`
4. `src/app/pages/dashboard/dashboard-one/dashboard-one.component.html`
5. `src/app/pages/participants/create-participant/create-participant.component.html`
6. `src/app/pages/cases/create-case/create-case.component.html`
7. Todos los archivos en `src/app/pages/configuration/`
8. `src/app/shared/advanced-table/advanced-table.component.html`

## Comando para Búsqueda de Textos Hardcodeados

```bash
# Buscar textos en español (patrones comunes)
grep -r "Seleccione\|Agregar\|Eliminar\|Editar\|Cancelar\|Guardar" src/app --include="*.html"

# Buscar atributos i18n que necesitan migración
grep -r 'i18n=' src/app --include="*.html"

# Buscar placeholders hardcodeados
grep -r 'placeholder="' src/app --include="*.html" | grep -v transloco
```

## Contacto y Soporte

Para dudas sobre la implementación de traducciones, referirse a:

- Documentación de Transloco: https://ngneat.github.io/transloco/
- Guía de estilos del proyecto: (pendiente)
