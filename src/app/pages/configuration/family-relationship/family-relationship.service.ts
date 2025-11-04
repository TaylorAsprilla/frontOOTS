import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import {
  FamilyRelationship,
  CreateFamilyRelationshipDto,
  UpdateFamilyRelationshipDto,
  FamilyRelationshipResponse,
  FamilyRelationshipListResponse,
} from './family-relationship.interface';

@Injectable({
  providedIn: 'root',
})
export class FamilyRelationshipService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly apiUrl = `${environment.apiUrl}/family-relationship`;

  private getHeaders(): HttpHeaders {
    const token = this.tokenStorageService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getFamilyRelationshipes(): Observable<FamilyRelationshipListResponse> {
    return this.http.get<FamilyRelationshipListResponse>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getFamilyRelationshipById(id: number): Observable<FamilyRelationshipResponse> {
    return this.http.get<FamilyRelationshipResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createFamilyRelationship(dto: CreateFamilyRelationshipDto): Observable<FamilyRelationshipResponse> {
    return this.http.post<FamilyRelationshipResponse>(this.apiUrl, dto, {
      headers: this.getHeaders(),
    });
  }

  updateFamilyRelationship(id: number, dto: UpdateFamilyRelationshipDto): Observable<FamilyRelationshipResponse> {
    return this.http.patch<FamilyRelationshipResponse>(`${this.apiUrl}/${id}`, dto, {
      headers: this.getHeaders(),
    });
  }

  deleteFamilyRelationship(id: number): Observable<FamilyRelationshipResponse> {
    return this.http.delete<FamilyRelationshipResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
