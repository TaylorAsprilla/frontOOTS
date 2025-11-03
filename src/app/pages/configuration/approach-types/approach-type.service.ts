import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ApproachType,
  ApproachTypeResponse,
  ApproachTypeListResponse,
  CreateApproachTypeDto,
  UpdateApproachTypeDto,
} from './approach-type.interface';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ApproachTypeService {
  private apiUrl = `${environment.apiUrl}/approach-types`;

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) {}

  private getHeaders(): HttpHeaders {
    const token = this.tokenStorageService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getApproachTypes(): Observable<ApproachTypeListResponse> {
    return this.http.get<ApproachTypeListResponse>(this.apiUrl, { headers: this.getHeaders() });
  }

  getApproachTypeById(id: number): Observable<ApproachTypeResponse> {
    return this.http.get<ApproachTypeResponse>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createApproachType(data: CreateApproachTypeDto): Observable<ApproachTypeResponse> {
    return this.http.post<ApproachTypeResponse>(this.apiUrl, data, { headers: this.getHeaders() });
  }

  updateApproachType(id: number, data: UpdateApproachTypeDto): Observable<ApproachTypeResponse> {
    return this.http.patch<ApproachTypeResponse>(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
  }

  deleteApproachType(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
