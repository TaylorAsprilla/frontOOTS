import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app.config';
import { registerLocaleData } from '@angular/common';
import localeEsCO from '@angular/common/locales/es-CO';
import localeEsPR from '@angular/common/locales/es-PR';
import localeEn from '@angular/common/locales/en';

registerLocaleData(localeEsCO, 'es-CO');
registerLocaleData(localeEsPR, 'es-PR');
registerLocaleData(localeEn, 'en-US');

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
