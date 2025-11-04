import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { Gender, GenderResponse, GenderListResponse, CreateGenderDto, UpdateGenderDto } from './gender.interface';

@Injectable({
  providedIn: 'root',
})
export class GenderService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly apiUrl = `${environment.apiUrl}/genders`;

  private getHeaders(): HttpHeaders {
    const token = this.tokenStorage.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getGenders(): Observable<GenderListResponse> {
    return this.http.get<GenderListResponse>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getGenderById(id: number): Observable<GenderResponse> {
    return this.http.get<GenderResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createGender(gender: CreateGenderDto): Observable<GenderResponse> {
    return this.http.post<GenderResponse>(this.apiUrl, gender, {
      headers: this.getHeaders(),
    });
  }

  updateGender(id: number, gender: UpdateGenderDto): Observable<GenderResponse> {
    return this.http.patch<GenderResponse>(`${this.apiUrl}/${id}`, gender, {
      headers: this.getHeaders(),
    });
  }

  deleteGender(id: number): Observable<GenderResponse> {
    return this.http.delete<GenderResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
