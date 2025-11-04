import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { DocumentTypeListResponse } from '../../configuration/document-types/document-type.interface';
import { DocumentTypeService } from '../../configuration/document-types/document-type.service';

export const documentTypesResolver: ResolveFn<DocumentTypeListResponse> = (
  route,
  state
): Observable<DocumentTypeListResponse> => {
  const documentTypeService = inject(DocumentTypeService);
  return documentTypeService.getDocumentTypes();
};
