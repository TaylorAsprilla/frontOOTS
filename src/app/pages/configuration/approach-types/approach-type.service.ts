import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApproachType, CreateApproachTypeDto, UpdateApproachTypeDto } from './approach-type.interface';
import { ApiResponse } from '../../../core/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ApproachTypeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/catalogs/approach-types`;

  /**
   * Get all approach types
   * @param includeInactive - Include inactive records
   */
  getAll(includeInactive: boolean = false): Observable<ApiResponse<ApproachType[]>> {
    let params = new HttpParams();
    if (includeInactive) {
      params = params.set('includeInactive', 'true');
    }
    return this.http.get<ApiResponse<ApproachType[]>>(this.apiUrl, { params });
  }

  /**
   * Get only active approach types
   */
  getActive(): Observable<ApproachType[]> {
    return new Observable((observer) => {
      this.getAll(false).subscribe({
        next: (response) => {
          observer.next(response.data);
          observer.complete();
        },
        error: (error) => observer.error(error),
      });
    });
  }

  /**
   * Get approach type by ID
   */
  getById(id: number): Observable<ApiResponse<ApproachType>> {
    return this.http.get<ApiResponse<ApproachType>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new approach type
   */
  create(dto: CreateApproachTypeDto): Observable<ApiResponse<ApproachType>> {
    return this.http.post<ApiResponse<ApproachType>>(this.apiUrl, dto);
  }

  /**
   * Update approach type
   */
  update(id: number, dto: UpdateApproachTypeDto): Observable<ApiResponse<ApproachType>> {
    return this.http.patch<ApiResponse<ApproachType>>(`${this.apiUrl}/${id}`, dto);
  }

  /**
   * Deactivate approach type (soft delete)
   */
  deactivate(id: number): Observable<ApiResponse<ApproachType>> {
    return this.http.delete<ApiResponse<ApproachType>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Activate approach type
   */
  activate(id: number): Observable<ApiResponse<ApproachType>> {
    return this.update(id, { isActive: true });
  }
}
