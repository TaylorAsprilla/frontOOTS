import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GenderService } from '../configuration/genders/gender.service';
import { Gender } from '../configuration/genders/gender.interface';

export const genderResolver: ResolveFn<Gender[]> = (): Observable<Gender[]> => {
  const genderService = inject(GenderService);

  return genderService.getGenders().pipe(
    map((response) => {
      // Filtrar solo los géneros activos
      return response.data.filter((gender) => gender.isActive);
    }),
    catchError((error) => {
      console.error('Error loading genders:', error);
      // Retornar array vacío en caso de error
      return of([]);
    })
  );
};
