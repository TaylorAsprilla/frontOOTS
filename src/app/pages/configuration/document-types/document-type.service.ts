import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  DocumentType,
  DocumentTypeResponse,
  DocumentTypeListResponse,
  CreateDocumentTypeDto,
  UpdateDocumentTypeDto,
} from './document-type.interface';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeService {
  private apiUrl = `${environment.apiUrl}/document-types`;

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) {}

  private getHeaders(): HttpHeaders {
    const token = this.tokenStorageService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getDocumentTypes(): Observable<DocumentTypeListResponse> {
    return this.http.get<DocumentTypeListResponse>(this.apiUrl, { headers: this.getHeaders() });
  }

  getDocumentTypeById(id: number): Observable<DocumentTypeResponse> {
    return this.http.get<DocumentTypeResponse>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createDocumentType(data: CreateDocumentTypeDto): Observable<DocumentTypeResponse> {
    return this.http.post<DocumentTypeResponse>(this.apiUrl, data, { headers: this.getHeaders() });
  }

  updateDocumentType(id: number, data: UpdateDocumentTypeDto): Observable<DocumentTypeResponse> {
    return this.http.patch<DocumentTypeResponse>(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
  }

  deleteDocumentType(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
