# Sistema de Traducciones Multi-País

## Estructura de Archivos

La aplicación utiliza **Transloco** para gestionar traducciones por país. Los archivos están organizados en `src/assets/i18n/`:

```
src/assets/i18n/
├── es-CO.json      # Español - Colombia
├── es-PR.json      # Español - Puerto Rico
├── en.json         # English - USA
└── es.json         # [Archivo base, no usado en producción]
```

## Configuración por País

### Colombia (`es-CO`)

- **Idioma**: Español colombiano
- **Moneda**: COP (Peso Colombiano)
- **Teléfono**: +57
- **Términos específicos**:
  - Estado/Provincia → **"Departamento"**
  - Seguro médico → **"EPS"**
  - Documento → "Cédula de Ciudadanía"
  - Validación de teléfono: formato colombiano (10 dígitos)

### Puerto Rico (`es-PR`)

- **Idioma**: Español puertorriqueño
- **Moneda**: USD (Dólar)
- **Teléfono**: +1
- **Términos específicos**:
  - Departamento/Provincia → **"Estado"**
  - EPS → **"Plan Médico"**
  - Documento → Drivers License, ID Card, SSN
  - Validación de teléfono: formato USA (+1)

### Estados Unidos (`en`)

- **Idioma**: English
- **Moneda**: USD (Dólar)
- **Teléfono**: +1
- **Términos específicos**:
  - State (Estado)
  - Health Insurance (Seguro médico)
  - ZIP Code (Código Postal)
  - Social Security Number (SSN)

## Diferencias Clave en Traducciones

### Terminología Geográfica

| Concepto            | Colombia         | Puerto Rico     | USA              |
| ------------------- | ---------------- | --------------- | ---------------- |
| Nivel regional      | Departamento     | Estado          | State            |
| Seguro médico       | EPS              | Plan Médico     | Health Insurance |
| Código postal       | Código Postal    | Código Postal   | ZIP Code         |
| Validación teléfono | 10 dígitos (+57) | 10 dígitos (+1) | 10 digits (+1)   |

### Títulos de Aplicación

- **es-CO**: "OOTS Colombia"
- **es-PR**: "OOTS Puerto Rico"
- **en**: "OOTS USA"

## Uso en la Aplicación

### CountryService

El servicio `CountryService` gestiona automáticamente el cambio de idioma basado en el país seleccionado:

```typescript
import { CountryService } from '@core/services/country.service';

constructor(private countryService: CountryService) {}

// Cambiar país (automáticamente cambia el idioma)
this.countryService.setCountry('CO');  // → cambia a es-CO
this.countryService.setCountry('PR');  // → cambia a es-PR
this.countryService.setCountry('US');  // → cambia a en
```

### Etiquetas Dinámicas

Para campos que cambian según el país (como "Departamento" vs "Estado" o "EPS" vs "Plan Médico"):

```typescript
// En el componente
get stateLabel(): string {
  return this.countryService.stateLabel;
}

get healthInsuranceLabel(): string {
  return this.countryService.healthInsuranceLabel;
}
```

```html
<!-- En el template -->
<label>{{ stateLabel }}</label>
<label>{{ healthInsuranceLabel }}</label>
```

O usando traducciones directamente:

```html
<label>{{ 'participants.state' | transloco }}</label> <label>{{ 'participants.healthInsurance' | transloco }}</label>
```

## Agregar Nuevas Traducciones

### 1. Agregar clave en todos los archivos

**es-CO.json**:

```json
{
  "participants": {
    "newField": "Nuevo Campo (Colombia)"
  }
}
```

**es-PR.json**:

```json
{
  "participants": {
    "newField": "Nuevo Campo (Puerto Rico)"
  }
}
```

**en.json**:

```json
{
  "participants": {
    "newField": "New Field"
  }
}
```

### 2. Usar en el template

```html
<label>{{ 'participants.newField' | transloco }}</label>
```

## Validaciones Específicas por País

Algunos campos tienen validaciones diferentes según el país:

### Número de Teléfono

```typescript
// Colombia: 10 dígitos, formato (###) ### ####
// Puerto Rico y USA: 10 dígitos, formato (###) ###-####

// El componente ngx-intl-tel-input maneja esto automáticamente
```

### Código Postal

```typescript
// Colombia: Obligatorio para envíos, formato numérico 6 dígitos
// Puerto Rico: Obligatorio, formato ZIP code 5 dígitos
// USA: Obligatorio, formato ZIP code 5 dígitos o ZIP+4
```

## Estructura JSON Recomendada

Los archivos de traducción siguen una estructura jerárquica:

```json
{
  "app": { ... },
  "navigation": { ... },
  "user": {
    "validation": { ... }
  },
  "participants": {
    "validation": { ... }
  },
  "configuration": { ... }
}
```

## Buenas Prácticas

1. **Mantener consistencia**: Todas las claves deben existir en los 3 archivos
2. **Estructura anidada**: Usar objetos anidados para organizar traducciones relacionadas
3. **Nombres descriptivos**: Usar nombres de claves claros y descriptivos
4. **Validaciones separadas**: Mantener mensajes de validación en subcategoría `validation`
5. **Términos específicos**: Documentar términos que varían significativamente entre países

## Fallback

Si una traducción no se encuentra:

1. Intenta usar la traducción del idioma actual
2. Si no existe, usa el `fallbackLang` (es-CO)
3. Si aún no existe, muestra la clave

Configurado en `transloco.config.ts`:

```typescript
defaultLang: 'es-CO',
fallbackLang: 'es-CO',
missingHandler: {
  useFallbackTranslation: true,
}
```

## Testing de Traducciones

Para verificar que todas las traducciones estén completas:

```bash
# Ejecutar la aplicación en modo desarrollo
npm start

# Cambiar entre países usando el selector de país en el navbar
# Verificar que todos los textos se muestren correctamente
```

## Referencias

- **Transloco Documentation**: https://ngneat.github.io/transloco/
- **CountryService**: `src/app/core/services/country.service.ts`
- **Transloco Config**: `src/app/transloco.config.ts`
- **Archivos de traducción**: `src/assets/i18n/`
