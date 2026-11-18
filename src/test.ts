import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
}
);

// Proveedores base para los specs "should create": HttpClient, Router y Transloco.
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@ngneat/transloco';

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [TranslocoTestingModule.forRoot({ langs: {}, translocoConfig: { availableLangs: ['es-CO'], defaultLang: 'es-CO' } })],
    providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
  });
});
