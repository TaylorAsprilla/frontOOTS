import { Routes } from '@angular/router';
import { AcademicLevelListComponent } from './academic-level-list/academic-level-list.component';
import { AcademicLevelFormComponent } from './academic-level-form/academic-level-form.component';

export const ACADEMIC_LEVEL_ROUTES: Routes = [
  {
    path: '',
    component: AcademicLevelListComponent,
  },
  {
    path: 'create',
    component: AcademicLevelFormComponent,
  },
  {
    path: 'edit/:id',
    component: AcademicLevelFormComponent,
  },
];
