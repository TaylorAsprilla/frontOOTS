import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProcessType } from './process-type.interface';
import { ProcessTypeService } from './process-type.service';

export const processTypeResolver: ResolveFn<ProcessType[]> = (route, state) => {
  return inject(ProcessTypeService).getActive();
};
