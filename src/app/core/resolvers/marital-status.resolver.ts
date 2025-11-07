import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MaritalStatusService } from '../../pages/configuration/marital-status/marital-status.service';
import { MaritalStatus } from '../../pages/configuration/marital-status/marital-status.interface';

export const maritalStatusResolver: ResolveFn<MaritalStatus[]> = (): Observable<MaritalStatus[]> => {
  const maritalStatusService = inject(MaritalStatusService);

  return maritalStatusService
    .getMaritalStatuses()
    .pipe(map((response) => response.data.filter((item) => item.isActive)));
};
