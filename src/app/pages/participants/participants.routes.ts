import { Routes } from '@angular/router';
import { documentTypesResolver } from '../../core/resolvers/document-types.resolver';
import { genderResolver } from '../../core/resolvers/gender.resolver';
import { maritalStatusResolver } from '../../core/resolvers/marital-status.resolver';
import { healthInsuranceResolver } from '../../core/resolvers/health-insurance.resolver';
import { familyRelationshipResolver } from '../../core/resolvers/family-relationship.resolver';
import { incomeSourceResolver } from '../../core/resolvers/income-source.resolver';
import { incomeLevelResolver } from '../../core/resolvers/income-level.resolver';
import { housingTypeResolver } from '../../core/resolvers/housing-type.resolver';

/**
 * Participants module routes configuration
 * Uses standalone components with lazy loading
 */
export const PARTICIPANTS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./participant-list/participant-list.component').then((m) => m.ParticipantListComponent),
    title: 'Participants - List',
    data: {
      breadcrumb: 'participants.list',
    },
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./create-participant/create-participant.component').then((m) => m.CreateParticipantComponent),
    title: 'Participants - Create New',
    data: {
      breadcrumb: 'participants.create',
    },
    resolve: {
      documentTypes: documentTypesResolver,
      genders: genderResolver,
      maritalStatuses: maritalStatusResolver,
      healthInsurances: healthInsuranceResolver,
      familyRelationships: familyRelationshipResolver,
      incomeSources: incomeSourceResolver,
      incomeLevels: incomeLevelResolver,
      housingTypes: housingTypeResolver,
    },
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./create-participant/create-participant.component').then((m) => m.CreateParticipantComponent),
    title: 'Participants - Edit',
    data: {
      breadcrumb: 'participants.edit',
      mode: 'edit',
    },
    resolve: {
      documentTypes: documentTypesResolver,
      genders: genderResolver,
      maritalStatuses: maritalStatusResolver,
      healthInsurances: healthInsuranceResolver,
      familyRelationships: familyRelationshipResolver,
      incomeSources: incomeSourceResolver,
      incomeLevels: incomeLevelResolver,
      housingTypes: housingTypeResolver,
    },
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./participant-detail/participant-detail.component').then((m) => m.ParticipantDetailComponent),
    title: 'Participants - Details',
    data: {
      breadcrumb: 'participants.detail',
    },
  },
  {
    path: '**',
    redirectTo: 'list',
  },
];
