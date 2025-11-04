import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import {
  HousingType,
  CreateHousingTypeDto,
  UpdateHousingTypeDto,
  HousingTypeResponse,
  HousingTypeListResponse,
} from './housing-type.interface';

@Injectable({
  providedIn: 'root',
})
export class HousingTypeService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly apiUrl = `${environment.apiUrl}/housing-type`;

  private getHeaders(): HttpHeaders {
    const token = this.tokenStorageService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getHousingTypees(): Observable<HousingTypeListResponse> {
    return this.http.get<HousingTypeListResponse>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getHousingTypeById(id: number): Observable<HousingTypeResponse> {
    return this.http.get<HousingTypeResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createHousingType(dto: CreateHousingTypeDto): Observable<HousingTypeResponse> {
    return this.http.post<HousingTypeResponse>(this.apiUrl, dto, {
      headers: this.getHeaders(),
    });
  }

  updateHousingType(id: number, dto: UpdateHousingTypeDto): Observable<HousingTypeResponse> {
    return this.http.patch<HousingTypeResponse>(`${this.apiUrl}/${id}`, dto, {
      headers: this.getHeaders(),
    });
  }

  deleteHousingType(id: number): Observable<HousingTypeResponse> {
    return this.http.delete<HousingTypeResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
