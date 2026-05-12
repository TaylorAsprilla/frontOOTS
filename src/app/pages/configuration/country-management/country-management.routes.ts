import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { CountryManagementComponent } from './country-management.component';
import { RoleService } from 'src/app/core/services/role.service';

export const COUNTRY_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    component: CountryManagementComponent,
    canActivate: [() => inject(RoleService).isAdmin()],
    data: { title: 'Gestión de Países', onlyAdmin: true },
  },
];
