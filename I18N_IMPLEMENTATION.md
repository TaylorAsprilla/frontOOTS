# Implementación de Internacionalización (i18n) con Transloco

## Resumen de la Implementación

Se ha implementado exitosamente la internacionalización en Angular 20 utilizando Transloco para soportar español (es) e inglés (en) con las siguientes características:

### ✅ Componentes Implementados

1. **TranslocoHttpLoaderService** - Carga traducciones desde archivos JSON
2. **LanguageService** - Gestión de cambios de idioma y persistencia
3. **LanguageSwitcherComponent** - Componente UI para cambio de idiomas
4. **Configuración completa** - app.config.ts con providers de Transloco

### ✅ Archivos de Traducción

- `/src/assets/i18n/es.json` - Traducciones en español
- `/src/assets/i18n/en.json` - Traducciones en inglés

Estructura organizada en secciones: `app`, `navigation`, `user`, `states`, `buttons`, `messages`

### ✅ Funcionalidades

- 🔄 Cambio dinámico de idioma sin recarga
- 💾 Persistencia de preferencia en localStorage
- 🌐 Detección automática del idioma del navegador
- 🎯 Componente standalone para fácil integración
- 📱 Diseño responsivo del selector de idiomas

## Cómo Usar las Traducciones

### 1. En Templates HTML

```html
<!-- Pipe de traducción básico -->
<h1>{{ 'app.title' | transloco }}</h1>

<!-- Con parámetros -->
<p>{{ 'navigation.switch_to' | transloco: { language: 'English' } }}</p>

<!-- Con directiva structural -->
<ng-container *transloco="let t">
  <h2>{{ t('user.create') }}</h2>
  <p>{{ t('user.searchPlaceholder') }}</p>
</ng-container>
```

### 2. En Componentes TypeScript

```typescript
import { Component, inject } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [TranslocoModule],
  template: `<h1>{{ 'app.welcome' | transloco }}</h1>`,
})
export class ExampleComponent {
  private transloco = inject(TranslocoService);

  // Traducción reactiva
  title$ = this.transloco.selectTranslate('app.title');

  // Traducción inmediata
  getMessage() {
    return this.transloco.translate('user.createSuccess');
  }

  // Con parámetros
  showUserMessage(userName: string) {
    return this.transloco.translate('user.userCreatedMessage', { name: userName });
  }
}
```

### 3. Usando LanguageService

```typescript
import { Component, inject } from '@angular/core';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-settings',
  template: `
    <button (click)="switchLanguage()">
      {{ 'buttons.change_language' | transloco }}
    </button>
    <p>{{ 'app.current_language' | transloco }}: {{ currentLanguage }}</p>
  `,
})
export class SettingsComponent {
  private languageService = inject(LanguageService);

  get currentLanguage() {
    return this.languageService.currentLanguage;
  }

  switchLanguage() {
    this.languageService.switchLanguage();
  }

  setSpanish() {
    this.languageService.setLanguage('es');
  }

  setEnglish() {
    this.languageService.setLanguage('en');
  }
}
```

## Ejemplo: Actualización del MemberInfoComponent

### Antes (Sin i18n):

```html
<div class="text-muted">{{ user.cargo || 'Sin cargo' }}</div>
<p class="mb-0 text-muted text-truncate">Participantes</p>
<p class="mb-0 text-muted text-truncate">Casos</p>
<p class="mb-0 text-muted text-truncate">Próximas Citas</p>
```

### Después (Con i18n):

```html
<div class="text-muted">{{ user.cargo || ('user.noPosition' | transloco) }}</div>
<p class="mb-0 text-muted text-truncate">{{ 'user.participants' | transloco }}</p>
<p class="mb-0 text-muted text-truncate">{{ 'user.cases' | transloco }}</p>
<p class="mb-0 text-muted text-truncate">{{ 'user.nextAppointments' | transloco }}</p>
```

**Component TypeScript Update:**

```typescript
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { UserInfoInterface } from 'src/app/core/interface/user.interface';

@Component({
  selector: 'app-contact-member-info',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule], // Agregar TranslocoModule
  templateUrl: './member-info.component.html',
  styleUrls: ['./member-info.component.scss'],
})
export class MemberInfoComponent implements OnInit {
  // ... resto del código igual
}
```

## Integración del LanguageSwitcher

### En Layouts/Componentes Principales

```html
<!-- En topbar/header -->
<li class="nav-item">
  <app-language-switcher></app-language-switcher>
</li>

<!-- En sidebar -->
<div class="sidebar-language">
  <app-language-switcher class="vertical"></app-language-switcher>
</div>

<!-- En footer -->
<div class="footer-controls">
  <app-language-switcher class="compact"></app-language-switcher>
</div>
```

### Importación en Módulos/Componentes

```typescript
import { LanguageSwitcherComponent } from 'path/to/language-switcher.component';

@Component({
  // ...
  imports: [LanguageSwitcherComponent]
})
```

## Estructura de Archivos Creados

```
src/
├── app/
│   ├── transloco.config.ts                     # Configuración de Transloco
│   ├── core/
│   │   └── services/
│   │       └── language.service.ts             # Servicio de gestión de idiomas
│   └── shared/
│       └── components/
│           └── language-switcher/
│               └── language-switcher.component.ts
├── assets/
│   └── i18n/
│       ├── es.json                             # Traducciones en español
│       └── en.json                             # Traducciones en inglés
└── app.config.ts                               # Configuración de providers
```

## Próximos Pasos

1. **Actualizar componentes existentes** para usar las traducciones
2. **Agregar más traducciones** según se vayan necesitando
3. **Implementar lazy loading** de traducciones para módulos específicos
4. **Configurar traducciones de formularios** y validaciones
5. **Agregar soporte para más idiomas** si es necesario

## Notas Técnicas

- Las traducciones se cargan de forma asíncrona desde `/assets/i18n/`
- El idioma se persiste en `localStorage` con clave `'app-language'`
- El sistema detecta automáticamente el idioma del navegador como fallback
- Compatible con Angular 20 y arquitectura standalone
- Soporte completo para lazy loading y tree shaking
