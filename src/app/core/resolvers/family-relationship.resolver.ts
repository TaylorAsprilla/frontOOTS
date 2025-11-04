import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FamilyRelationshipService } from '../../pages/configuration/family-relationship/family-relationship.service';
import { FamilyRelationship } from '../../pages/configuration/family-relationship/family-relationship.interface';

export const familyRelationshipResolver: ResolveFn<FamilyRelationship[]> = (): Observable<FamilyRelationship[]> => {
  const familyRelationshipService = inject(FamilyRelationshipService);

  return familyRelationshipService
    .getFamilyRelationships()
    .pipe(map((response) => response.data.filter((item) => item.isActive)));
};
