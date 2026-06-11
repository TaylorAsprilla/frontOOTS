import { Routes } from '@angular/router';
import { familyRelationshipResolver } from '../../core/resolvers/family-relationship.resolver';
import { academicLevelResolver } from '../../core/resolvers/academic-level.resolver';
import { incomeSourceResolver } from '../../core/resolvers/income-source.resolver';
import { incomeLevelResolver } from '../../core/resolvers/income-level.resolver';
import { housingTypeResolver } from '../../core/resolvers/housing-type.resolver';
import { processTypeResolver } from '../configuration/process-types/process-type.resolver';
import { approachTypeResolver } from '../configuration/approach-types/approach-type.resolver';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';

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
    canDeactivate: [unsavedChangesGuard],
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
    canDeactivate: [unsavedChangesGuard],
    data: {
      breadcrumb: 'cases.edit',
      mode: 'edit',
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
    path: 'detail/:id',
    loadComponent: () => import('./create-case/create-case.component').then((m) => m.CreateCaseComponent),
    title: 'Cases - Details',
    data: {
      breadcrumb: 'cases.detail',
      mode: 'view',
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
    path: ':caseId/discussions',
    loadChildren: () =>
      import('./case-discussions/routes/case-discussions.routes').then((m) => m.CASE_DISCUSSION_ROUTES),
    title: 'Case Discussions',
    data: {
      breadcrumb: 'Discusiones del caso',
    },
  },
  {
    path: '**',
    redirectTo: 'list',
  },
];
