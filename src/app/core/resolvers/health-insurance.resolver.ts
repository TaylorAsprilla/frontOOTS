import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HealthInsuranceService } from '../../pages/configuration/health-insurance/health-insurance.service';
import { HealthInsurance } from '../../pages/configuration/health-insurance/health-insurance.interface';

export const healthInsuranceResolver: ResolveFn<HealthInsurance[]> = (): Observable<HealthInsurance[]> => {
  const healthInsuranceService = inject(HealthInsuranceService);

  return healthInsuranceService
    .getHealthInsurances()
    .pipe(map((response) => response.data.filter((item) => item.isActive)));
};
