import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProcessType, CreateProcessTypeDto, UpdateProcessTypeDto } from './process-type.interface';
import { ApiResponse } from '../../../core/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ProcessTypeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/catalogs/process-types`;

  /**
   * Get all process types
   * @param includeInactive - Include inactive records
   */
  getAll(includeInactive: boolean = false): Observable<ApiResponse<ProcessType[]>> {
    let params = new HttpParams();
    console.log('Include Inactive:', includeInactive, this.apiUrl);
    if (includeInactive) {
      params = params.set('includeInactive', 'true');
    }
    return this.http.get<ApiResponse<ProcessType[]>>(this.apiUrl, { params });
  }

  /**
   * Get only active process types
   */
  getActive(): Observable<ProcessType[]> {
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
   * Get process type by ID
   */
  getById(id: number): Observable<ApiResponse<ProcessType>> {
    return this.http.get<ApiResponse<ProcessType>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new process type
   */
  create(dto: CreateProcessTypeDto): Observable<ApiResponse<ProcessType>> {
    return this.http.post<ApiResponse<ProcessType>>(this.apiUrl, dto);
  }

  /**
   * Update process type
   */
  update(id: number, dto: UpdateProcessTypeDto): Observable<ApiResponse<ProcessType>> {
    return this.http.patch<ApiResponse<ProcessType>>(`${this.apiUrl}/${id}`, dto);
  }

  /**
   * Deactivate process type (soft delete)
   */
  deactivate(id: number): Observable<ApiResponse<ProcessType>> {
    return this.http.delete<ApiResponse<ProcessType>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Activate process type
   */
  activate(id: number): Observable<ApiResponse<ProcessType>> {
    return this.update(id, { isActive: true });
  }
}
