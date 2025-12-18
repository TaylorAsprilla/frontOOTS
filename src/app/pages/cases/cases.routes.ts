import { Routes } from '@angular/router';
import { familyRelationshipResolver } from '../../core/resolvers/family-relationship.resolver';
import { academicLevelResolver } from '../../core/resolvers/academic-level.resolver';
import { incomeSourceResolver } from '../../core/resolvers/income-source.resolver';
import { incomeLevelResolver } from '../../core/resolvers/income-level.resolver';
import { housingTypeResolver } from '../../core/resolvers/housing-type.resolver';
import { processTypeResolver } from '../configuration/process-types/process-type.resolver';
import { approachTypeResolver } from '../configuration/approach-types/approach-type.resolver';

/**
 * Cases module routes configuration
 * Uses standalone components with lazy loading
 */
export const CASES_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () => import('./case-list/case-list.component').then((m) => m.CaseListComponent),
    title: 'Cases - List',
    data: {
      breadcrumb: 'cases.list',
    },
  },
  {
    path: 'create/:participantId',
    loadComponent: () => import('./create-case/create-case.component').then((m) => m.CreateCaseComponent),
    title: 'Cases - Create New',
    data: {
      breadcrumb: 'cases.create',
    },
    resolve: {
      familyRelationships: familyRelationshipResolver,
      academicLevels: academicLevelResolver,
      incomeSources: incomeSourceResolver,
      incomeLevels: incomeLevelResolver,
      housingTypes: housingTypeResolver,
      processTypes: processTypeResolver,
      approachTypes: approachTypeResolver,
    },
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./create-case/create-case.component').then((m) => m.CreateCaseComponent),
    title: 'Cases - Edit',
    data: {
      breadcrumb: 'cases.edit',
      mode: 'edit',
    },
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./case-detail/case-detail.component').then((m) => m.CaseDetailComponent),
    title: 'Cases - Details',
    data: {
      breadcrumb: 'cases.detail',
    },
  },
  {
    path: '**',
    redirectTo: 'list',
  },
];
