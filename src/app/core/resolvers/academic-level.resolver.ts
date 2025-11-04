import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcademicLevelService } from '../services/academic-level.service';
import { AcademicLevel } from '../interfaces/academic-level.interface';

/**
 * Resolver para cargar niveles académicos antes de renderizar la ruta.
 * Filtra solo los niveles académicos activos.
 */
export const academicLevelResolver: ResolveFn<AcademicLevel[]> = (): Observable<AcademicLevel[]> => {
  const academicLevelService = inject(AcademicLevelService);

  return academicLevelService
    .getAcademicLevels()
    .pipe(map((response) => response.data.filter((item) => item.isActive)));
};
