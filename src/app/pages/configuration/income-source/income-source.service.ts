import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import {
  IncomeSource,
  CreateIncomeSourceDto,
  UpdateIncomeSourceDto,
  IncomeSourceResponse,
  IncomeSourceListResponse,
} from './income-source.interface';

@Injectable({
  providedIn: 'root',
})
export class IncomeSourceService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly apiUrl = `${environment.apiUrl}/income-source`;

  private getHeaders(): HttpHeaders {
    const token = this.tokenStorageService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getIncomeSources(): Observable<IncomeSourceListResponse> {
    return this.http.get<IncomeSourceListResponse>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getIncomeSourceById(id: number): Observable<IncomeSourceResponse> {
    return this.http.get<IncomeSourceResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createIncomeSource(dto: CreateIncomeSourceDto): Observable<IncomeSourceResponse> {
    return this.http.post<IncomeSourceResponse>(this.apiUrl, dto, {
      headers: this.getHeaders(),
    });
  }

  updateIncomeSource(id: number, dto: UpdateIncomeSourceDto): Observable<IncomeSourceResponse> {
    return this.http.patch<IncomeSourceResponse>(`${this.apiUrl}/${id}`, dto, {
      headers: this.getHeaders(),
    });
  }

  deleteIncomeSource(id: number): Observable<IncomeSourceResponse> {
    return this.http.delete<IncomeSourceResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
