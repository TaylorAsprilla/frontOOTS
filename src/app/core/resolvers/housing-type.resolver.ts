import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HousingTypeService } from '../../pages/configuration/housing-type/housing-type.service';
import { HousingType } from '../../pages/configuration/housing-type/housing-type.interface';

export const housingTypeResolver: ResolveFn<HousingType[]> = (): Observable<HousingType[]> => {
  const housingTypeService = inject(HousingTypeService);

  return housingTypeService.getHousingTypes().pipe(map((response) => response.data.filter((item) => item.isActive)));
};
