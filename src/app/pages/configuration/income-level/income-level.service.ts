import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import {
  IncomeLevel,
  CreateIncomeLevelDto,
  UpdateIncomeLevelDto,
  IncomeLevelResponse,
  IncomeLevelListResponse,
} from './income-level.interface';

@Injectable({
  providedIn: 'root',
})
export class IncomeLevelService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly apiUrl = `${environment.apiUrl}/income-level`;

  private getHeaders(): HttpHeaders {
    const token = this.tokenStorageService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getIncomeLeveles(): Observable<IncomeLevelListResponse> {
    return this.http.get<IncomeLevelListResponse>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getIncomeLevelById(id: number): Observable<IncomeLevelResponse> {
    return this.http.get<IncomeLevelResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createIncomeLevel(dto: CreateIncomeLevelDto): Observable<IncomeLevelResponse> {
    return this.http.post<IncomeLevelResponse>(this.apiUrl, dto, {
      headers: this.getHeaders(),
    });
  }

  updateIncomeLevel(id: number, dto: UpdateIncomeLevelDto): Observable<IncomeLevelResponse> {
    return this.http.patch<IncomeLevelResponse>(`${this.apiUrl}/${id}`, dto, {
      headers: this.getHeaders(),
    });
  }

  deleteIncomeLevel(id: number): Observable<IncomeLevelResponse> {
    return this.http.delete<IncomeLevelResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
