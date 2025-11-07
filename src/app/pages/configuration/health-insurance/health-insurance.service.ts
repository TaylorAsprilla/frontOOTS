import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import {
  HealthInsurance,
  CreateHealthInsuranceDto,
  UpdateHealthInsuranceDto,
  HealthInsuranceResponse,
  HealthInsuranceListResponse,
} from './health-insurance.interface';

@Injectable({
  providedIn: 'root',
})
export class HealthInsuranceService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly apiUrl = `${environment.apiUrl}/health-insurance`;

  private getHeaders(): HttpHeaders {
    const token = this.tokenStorageService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getHealthInsurances(): Observable<HealthInsuranceListResponse> {
    return this.http.get<HealthInsuranceListResponse>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getHealthInsuranceById(id: number): Observable<HealthInsuranceResponse> {
    return this.http.get<HealthInsuranceResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createHealthInsurance(dto: CreateHealthInsuranceDto): Observable<HealthInsuranceResponse> {
    return this.http.post<HealthInsuranceResponse>(this.apiUrl, dto, {
      headers: this.getHeaders(),
    });
  }

  updateHealthInsurance(id: number, dto: UpdateHealthInsuranceDto): Observable<HealthInsuranceResponse> {
    return this.http.patch<HealthInsuranceResponse>(`${this.apiUrl}/${id}`, dto, {
      headers: this.getHeaders(),
    });
  }

  deleteHealthInsurance(id: number): Observable<HealthInsuranceResponse> {
    return this.http.delete<HealthInsuranceResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
