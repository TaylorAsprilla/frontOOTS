import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IncomeSourceService } from '../../pages/configuration/income-source/income-source.service';
import { IncomeSource } from '../../pages/configuration/income-source/income-source.interface';

export const incomeSourceResolver: ResolveFn<IncomeSource[]> = (): Observable<IncomeSource[]> => {
  const incomeSourceService = inject(IncomeSourceService);

  return incomeSourceService.getIncomeSources().pipe(map((response) => response.data.filter((item) => item.isActive)));
};
