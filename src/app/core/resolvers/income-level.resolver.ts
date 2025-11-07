import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IncomeLevelService } from '../../pages/configuration/income-level/income-level.service';
import { IncomeLevel } from '../../pages/configuration/income-level/income-level.interface';

export const incomeLevelResolver: ResolveFn<IncomeLevel[]> = (): Observable<IncomeLevel[]> => {
  const incomeLevelService = inject(IncomeLevelService);

  return incomeLevelService.getIncomeLevels().pipe(map((response) => response.data.filter((item) => item.isActive)));
};
