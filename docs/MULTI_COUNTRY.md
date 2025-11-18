# Sistema Multi-País - OOTS

## 📋 Índice

1. [Introducción](#introducción)
2. [Arquitectura](#arquitectura)
3. [Países Soportados](#países-soportados)
4. [Implementación](#implementación)
5. [Uso en Componentes](#uso-en-componentes)
6. [Agregar Nuevo País](#agregar-nuevo-país)
7. [Terminología por País](#terminología-por-país)

---

## Introducción

El sistema OOTS soporta múltiples países, cada uno con su propia terminología, configuración regional y preferencias. El sistema actual soporta:

- 🇨🇴 **Colombia**
- 🇵🇷 **Puerto Rico**
- 🇺🇸 **United States (USA)**

### Diferencias Clave por País

| Concepto           | Colombia              | Puerto Rico     | USA              |
| ------------------ | --------------------- | --------------- | ---------------- |
| Seguro de Salud    | EPS                   | Plan Médico     | Health Insurance |
| Idioma             | Español (es-CO)       | Español (es-PR) | English (en)     |
| Moneda             | COP (Peso Colombiano) | USD (Dólar)     | USD (Dólar)      |
| Prefijo Telefónico | +57                   | +1              | +1               |
| Locale             | es-CO                 | es-PR           | en               |

---

## Arquitectura

### Servicios

El sistema utiliza un único servicio para gestionar tanto países como idiomas:

- **`CountryService`**: Servicio principal que gestiona:
  - Selección y configuración de países (Colombia, Puerto Rico)
  - Cambio de idioma (Español, Inglés)
  - Sincronización con el sistema de traducciones (Transloco)
  - Persistencia de preferencias en localStorage

### Estructura de Archivos

```
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       └── country.service.ts          # Servicio único de países e idiomas
│   ├── layout/
│   │   └── shared/
│   │       └── country-selector/           # Componente selector de país
│   │           ├── country-selector.component.ts
│   │           ├── country-selector.component.html
│   │           └── country-selector.component.scss
│   └── shared/
│       └── components/
│           └── language-switcher/          # Componente selector de idioma
│               ├── language-switcher.component.ts
│               ├── language-switcher.component.html
│               └── language-switcher.component.scss
│
├── assets/
│   └── i18n/
│       ├── es-CO.json                      # Traducciones Colombia
│       ├── es-PR.json                      # Traducciones Puerto Rico
│       └── en.json                         # Traducciones Inglés
│
└── environments/
    ├── environment.ts                      # Configuración desarrollo
    └── environment.prod.ts                 # Configuración producción
```

### Componentes Clave

#### 1. CountryService

Servicio único que gestiona:

- **Países**: País actual, configuración por país (moneda, locale, prefijo telefónico)
- **Idiomas**: Cambio entre español e inglés, manteniendo el país seleccionado
- **Persistencia**: Guarda preferencias en localStorage
- **Integración**: Sincroniza automáticamente con Transloco para cargar las traducciones correctas

**Métodos principales:**

```typescript
// Gestión de países
setCountry(country: CountryCode): void
getCurrentCountry(): CountryCode
getCurrentConfig(): CountryConfig
getAvailableCountries(): CountryConfig[]

// Gestión de idiomas
setBaseLanguage(language: BaseLanguage): void  // 'es' o 'en'
setLanguage(language: SupportedLanguage): void // 'es-CO', 'es-PR', 'en'
switchLanguage(): void  // Alterna entre español e inglés
isBaseLanguageActive(language: BaseLanguage): boolean

// Utilidades
getLocaleForLanguage(baseLanguage: 'es' | 'en'): string
getCountryTerm(baseKey: string): string
```

#### 2. CountrySelectorComponent

Dropdown en el navbar para:

- Mostrar país actual con bandera
- Listar países disponibles
- Cambiar país seleccionado

#### 3. LanguageSwitcherComponent

Selector de idioma base en el navbar:

- Banderas para español e inglés
- Mantiene el país actual al cambiar idioma
- Se integra con CountryService

#### 4. Archivos de Traducción por País

Cada país tiene su propio archivo JSON con terminología específica:

- `es-CO.json` - Español de Colombia
- `es-PR.json` - Español de Puerto Rico
- `en.json` - English (United States)

---

## Países Soportados

### Colombia (CO)

```typescript
{
  code: 'CO',
  name: 'Colombia',
  locale: 'es-CO',
  currency: 'COP',
  phonePrefix: '+57',
  flag: 'https://flagcdn.com/w20/co.png'
}
```

**Terminología Específica:**

- EPS (Entidad Promotora de Salud)
- Cédula de Ciudadanía
- Documento de Identidad

### Puerto Rico (PR)

```typescript
{
  code: 'PR',
  name: 'Puerto Rico',
  locale: 'es-PR',
  currency: 'USD',
  phonePrefix: '+1',
  flag: 'https://flagcdn.com/w20/pr.png'
}
```

**Terminología Específica:**

- Plan Médico
- Seguro Social
- Licencia de Conducir

### United States (US)

```typescript
{
  code: 'US',
  name: 'United States',
  locale: 'en',
  currency: 'USD',
  phonePrefix: '+1',
  flag: 'https://flagcdn.com/w20/us.png'
}
```

**Specific Terminology:**

- Health Insurance
- Social Security Number
- Driver's License
  flag: '🇨🇴'
  }

````

**Terminología Específica:**

- EPS (Entidad Promotora de Salud)
- Cédula de Ciudadanía
- Documento de Identidad

### Puerto Rico (PR)

```typescript
{
  code: 'PR',
  name: 'Puerto Rico',
  locale: 'es-PR',
  currency: 'USD',
  phonePrefix: '+1',
  flag: 'https://flagcdn.com/w20/pr.png'
}
````

**Terminología Específica:**

- Plan Médico
- Seguro Social
- Licencia de Conducir

### United States (US)

```typescript
{
  code: 'US',
  name: 'United States',
  locale: 'en',
  currency: 'USD',
  phonePrefix: '+1',
  flag: 'https://flagcdn.com/w20/us.png'
}
```

**Specific Terminology:**

- Health Insurance
- Social Security Number
- Driver's License

**Terminología Específica:**

- Plan Médico
- Seguro Social
- Licencia de Conducir

---

## Implementación

### 1. Configurar Transloco

**`src/app/transloco.config.ts`**

```typescript
export const translocoAppConfig = translocoConfig({
  availableLangs: [
    { id: 'es-CO', label: 'Español (Colombia)' },
    { id: 'es-PR', label: 'Español (Puerto Rico)' },
    { id: 'en', label: 'English' },
  ],
  defaultLang: 'es-CO',
  fallbackLang: 'es-CO',
  reRenderOnLangChange: true,
  prodMode: !isDevMode(),
  missingHandler: {
    useFallbackTranslation: true,
  },
  flatten: {
    aot: false,
  },
});
```

### 2. Integrar CountryService

**En app.config.ts:**

```typescript
import { CountryService } from './core/services/country.service';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers
    CountryService,
    // ...
  ],
};
```

### 3. Agregar Selector en Navbar

**En topbar.component.html:**

```html
<ul class="navbar-nav">
  <!-- Selector de País -->
  <li class="nav-item">
    <app-country-selector></app-country-selector>
  </li>

  <!-- Selector de Idioma Base -->
  <li class="nav-item">
    <app-language-switcher></app-language-switcher>
  </li>

  <!-- ... otros items -->
</ul>
```

**En topbar.component.ts:**

```typescript
import { CountrySelectorComponent } from '../country-selector/country-selector.component';
import { LanguageSwitcherComponent } from '../../../shared/components/language-switcher/language-switcher.component';

@Component({
  // ...
  imports: [
    // ... otros imports
    CountrySelectorComponent,
    LanguageSwitcherComponent
  ]
})
```

---

## Uso en Componentes

### Ejemplo 1: Usar en HTML con Pipe de Transloco

```html
<!-- El texto cambiará automáticamente según el país seleccionado -->
<label>{{ 'healthInsurance.title' | transloco }}</label>

<!-- Colombia: "EPS" -->
<!-- Puerto Rico: "Plan Médico" -->
```

### Ejemplo 2: Usar en TypeScript

```typescript
import { CountryService } from 'src/app/core/services/country.service';
import { TranslocoService } from '@ngneat/transloco';

export class MyComponent implements OnInit {
  constructor(private countryService: CountryService, private transloco: TranslocoService) {}

  ngOnInit(): void {
    // Obtener país actual
    const currentCountry = this.countryService.getCurrentCountry();
    console.log('País:', currentCountry); // 'CO' o 'PR'

    // Obtener configuración completa
    const config = this.countryService.getCurrentConfig();
    console.log('Moneda:', config.currency); // 'COP' o 'USD'
    console.log('Prefijo:', config.phonePrefix); // '+57' o '+1'

    // Obtener idioma actual
    const currentLang = this.countryService.currentLanguage;
    console.log('Idioma:', currentLang); // 'es-CO', 'es-PR' o 'en'

    // Traducción específica del país
    const healthLabel = this.transloco.translate('healthInsurance.title');
    // Colombia: "EPS"
    // Puerto Rico: "Plan Médico"
  }

  // Cambiar país programáticamente
  changeToCountry(code: 'CO' | 'PR'): void {
    this.countryService.setCountry(code);
  }

  // Cambiar idioma base (mantiene el país)
  changeLanguage(lang: 'es' | 'en'): void {
    this.countryService.setBaseLanguage(lang);
  }
}
```

### Ejemplo 3: Reaccionar a Cambios de País o Idioma

```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class MyComponent implements OnInit {
  constructor(private countryService: CountryService, private destroyRef = inject(DestroyRef)) {}

  ngOnInit(): void {
    // Suscribirse a cambios de país
    this.countryService.currentCountry$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((country) => {
      console.log('País cambió a:', country);
      this.loadData();
    });

    // Suscribirse a cambios de idioma
    this.countryService.currentLanguage$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((language) => {
      console.log('Idioma cambió a:', language);
      this.updateUI();
    });
  }

  loadData(): void {
    // Cargar datos según país actual
    const country = this.countryService.getCurrentCountry();
    // ...
  }

  updateUI(): void {
    // Actualizar interfaz según idioma
    // ...
  }
}
```

---

## Agregar Nuevo País

### Paso 1: Actualizar CountryService

**`src/app/core/services/country.service.ts`**

```typescript
export type CountryCode = 'CO' | 'PR' | 'MX'; // Agregar nuevo código

private readonly countryConfigs: Record<CountryCode, CountryConfig> = {
  CO: { /* ... */ },
  PR: { /* ... */ },
  MX: { // Nuevo país
    code: 'MX',
    name: 'México',
    locale: 'es-MX',
    currency: 'MXN',
    phonePrefix: '+52',
    flag: '🇲🇽'
  }
};
```

### Paso 2: Crear Archivo de Traducción

**`src/assets/i18n/es-MX.json`**

1. Copiar `es-CO.json` como base:

   ```bash
   cp src/assets/i18n/es-CO.json src/assets/i18n/es-MX.json
   ```

2. Actualizar términos específicos de México:
   ```json
   {
     "healthInsurance": {
       "title": "IMSS/ISSSTE",
       "searchPlaceholder": "Buscar institución de salud..."
       // ... otras traducciones
     }
   }
   ```

### Paso 3: Actualizar Transloco Config

**`src/app/transloco.config.ts`**

```typescript
availableLangs: [
  { id: 'es-CO', label: 'Español (Colombia)' },
  { id: 'es-PR', label: 'Español (Puerto Rico)' },
  { id: 'es-MX', label: 'Español (México)' }, // Nuevo
  { id: 'en', label: 'English' }
],
```

---

## Terminología por País

### Términos Comunes que Varían

| Concepto               | Colombia  | Puerto Rico   | Clave JSON              |
| ---------------------- | --------- | ------------- | ----------------------- |
| Seguro de Salud        | EPS       | Plan Médico   | `healthInsurance.title` |
| Documento de Identidad | Cédula    | Seguro Social | `documentType` (futuro) |
| Municipio              | Municipio | Municipio     | `municipality`          |
| Barrio                 | Barrio    | Urbanización  | `neighborhood` (futuro) |

### Ejemplo de Estructura JSON

**es-CO.json:**

```json
{
  "healthInsurance": {
    "title": "EPS",
    "searchPlaceholder": "Buscar EPS...",
    "namePlaceholder": "Ej: Sura, Sanitas, Compensar..."
  }
}
```

**es-PR.json:**

```json
{
  "healthInsurance": {
    "title": "Plan Médico",
    "searchPlaceholder": "Buscar planes médicos...",
    "namePlaceholder": "Ej: Triple-S, MMM, Plan de Salud..."
  }
}
```

---

## Best Practices

### ✅ Hacer

1. **Usar siempre claves de traducción** en lugar de texto hardcodeado
2. **Mantener consistencia** en nombres de claves entre países
3. **Documentar diferencias** terminológicas en este archivo
4. **Probar con ambos países** antes de hacer commit
5. **Usar el servicio CountryService** para lógica específica por país

### ❌ Evitar

1. **NO hardcodear texto** en español en componentes
2. **NO asumir que Colombia es el único país**
3. **NO crear lógica condicional** por país en múltiples lugares
4. **NO olvidar actualizar** todos los archivos de traducción
5. **NO usar abreviaciones** sin contexto (ej: solo "EPS" sin explicación)

---

## Testing

### Probar Cambio de País

```typescript
describe('CountryService', () => {
  let service: CountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryService);
  });

  it('should change country to PR', () => {
    service.setCountry('PR');
    expect(service.getCurrentCountry()).toBe('PR');
    expect(service.getCurrentConfig().locale).toBe('es-PR');
  });

  it('should persist country in localStorage', () => {
    service.setCountry('CO');
    const saved = localStorage.getItem('selectedCountry');
    expect(saved).toBe('CO');
  });
});
```

---

## Troubleshooting

### Problema: Las traducciones no cambian

**Causa:** Transloco no se actualizó al cambiar de país

**Solución:** Verificar que CountryService llama a `translocoService.setActiveLang()`

### Problema: País no se persiste

**Causa:** localStorage no está disponible

**Solución:** Verificar permisos del navegador y que no esté en modo incógnito

### Problema: Aparece texto en inglés

**Causa:** Falta traducción en el archivo del país

**Solución:** Agregar la clave faltante al archivo `es-XX.json` correspondiente

---

## Roadmap

### Completado ✅

- ✅ Servicio CountryService
- ✅ Selector de país en navbar
- ✅ Archivos de traducción por país (CO, PR)
- ✅ Integración con Transloco
- ✅ Persistencia en localStorage

### Planificado 📋

- 📋 Agregar más países (México, etc.)
- 📋 Configuración de formatos de fecha por país
- 📋 Configuración de formatos de número/moneda
- 📋 Validaciones específicas por país (documentos, teléfonos)
- 📋 Panel de administración para gestionar países

---

## Contacto

Para preguntas o sugerencias sobre el sistema multi-país:

- Email: desarrollo@ootscolombia.com
- Slack: #oots-multi-country

---

<div align="center">

**Sistema Multi-País - OOTS Colombia**

_Última actualización: Noviembre 2025 - v1.2.0_

</div>
