import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ApproachTypeService } from './approach-type.service';
import { ApproachType } from './approach-type.interface';

export const approachTypeResolver: ResolveFn<ApproachType[]> = (route, state) => {
  return inject(ApproachTypeService).getActive();
};
