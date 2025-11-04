import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import {
  MaritalStatus,
  CreateMaritalStatusDto,
  UpdateMaritalStatusDto,
  MaritalStatusResponse,
  MaritalStatusListResponse,
} from './marital-status.interface';

@Injectable({
  providedIn: 'root',
})
export class MaritalStatusService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly apiUrl = `${environment.apiUrl}/marital-status`;

  private getHeaders(): HttpHeaders {
    const token = this.tokenStorageService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getMaritalStatuses(): Observable<MaritalStatusListResponse> {
    return this.http.get<MaritalStatusListResponse>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getMaritalStatusById(id: number): Observable<MaritalStatusResponse> {
    return this.http.get<MaritalStatusResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createMaritalStatus(dto: CreateMaritalStatusDto): Observable<MaritalStatusResponse> {
    return this.http.post<MaritalStatusResponse>(this.apiUrl, dto, {
      headers: this.getHeaders(),
    });
  }

  updateMaritalStatus(id: number, dto: UpdateMaritalStatusDto): Observable<MaritalStatusResponse> {
    return this.http.patch<MaritalStatusResponse>(`${this.apiUrl}/${id}`, dto, {
      headers: this.getHeaders(),
    });
  }

  deleteMaritalStatus(id: number): Observable<MaritalStatusResponse> {
    return this.http.delete<MaritalStatusResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
