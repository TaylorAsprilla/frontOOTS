import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  Participant,
  ParticipantFormData,
  ParticipantResponse,
  ParticipantListResponse,
  ParticipantStatus,
} from '../interfaces/participant.interface';
import { NotificationService } from './notification.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ParticipantService {
  url = environment.apiUrl;

  private readonly http = inject(HttpClient);
  private readonly notificationService = inject(NotificationService);
  private readonly apiUrl = `${this.url}/participants`; // Base API URL

  // State management
  private participantsSubject = new BehaviorSubject<Participant[]>([]);
  public participants$ = this.participantsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  /**
   * Get all participants with optional filtering
   */
  getParticipants(filters?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: ParticipantStatus;
  }): Observable<ParticipantListResponse> {
    this.loadingSubject.next(true);

    let params = '';
    if (filters) {
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
      params = searchParams.toString() ? `?${searchParams.toString()}` : '';
    }

    return this.http.get<ParticipantListResponse>(`${this.apiUrl}${params}`).pipe(
      map((response) => {
        this.participantsSubject.next(response.data);
        this.loadingSubject.next(false);
        return response;
      }),
      catchError((error) => {
        this.loadingSubject.next(false);
        this.notificationService.showError('Failed to load participants');
        return throwError(() => error);
      })
    );
  }

  /**
   * Get participant by ID
   */
  getParticipantById(id: string): Observable<ParticipantResponse> {
    this.loadingSubject.next(true);

    return this.http.get<ParticipantResponse>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        this.loadingSubject.next(false);
        return response;
      }),
      catchError((error) => {
        this.loadingSubject.next(false);
        this.notificationService.showError('Failed to load participant details');
        return throwError(() => error);
      })
    );
  }

  /**
   * Create new participant
   */
  createParticipant(participantData: ParticipantFormData): Observable<ParticipantResponse> {
    this.loadingSubject.next(true);

    return this.http.post<ParticipantResponse>(`${this.apiUrl}`, participantData).pipe(
      map((response) => {
        this.loadingSubject.next(false);
        this.notificationService.showSuccess('Participant created successfully');

        // Update local state
        const currentParticipants = this.participantsSubject.value;
        this.participantsSubject.next([...currentParticipants, response.data]);

        return response;
      }),
      catchError((error) => {
        this.loadingSubject.next(false);
        this.notificationService.showError('Failed to create participant');
        return throwError(() => error);
      })
    );
  }

  /**
   * Update existing participant
   */
  updateParticipant(id: string, participantData: Partial<ParticipantFormData>): Observable<ParticipantResponse> {
    this.loadingSubject.next(true);

    return this.http.put<ParticipantResponse>(`${this.apiUrl}/${id}`, participantData).pipe(
      map((response) => {
        this.loadingSubject.next(false);
        this.notificationService.showSuccess('Participant updated successfully');

        // Update local state
        const currentParticipants = this.participantsSubject.value;
        const updatedParticipants = currentParticipants.map((p) => (p.id === id ? response.data : p));
        this.participantsSubject.next(updatedParticipants);

        return response;
      }),
      catchError((error) => {
        this.loadingSubject.next(false);
        this.notificationService.showError('Failed to update participant');
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete participant
   */
  deleteParticipant(id: string): Observable<{ success: boolean; message?: string }> {
    this.loadingSubject.next(true);

    return this.http.delete<{ success: boolean; message?: string }>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        this.loadingSubject.next(false);
        this.notificationService.showSuccess('Participant deleted successfully');

        // Update local state
        const currentParticipants = this.participantsSubject.value;
        const filteredParticipants = currentParticipants.filter((p) => p.id !== id);
        this.participantsSubject.next(filteredParticipants);

        return response;
      }),
      catchError((error) => {
        this.loadingSubject.next(false);
        this.notificationService.showError('Failed to delete participant');
        return throwError(() => error);
      })
    );
  }

  /**
   * Update participant status
   */
  updateParticipantStatus(id: string, status: ParticipantStatus): Observable<ParticipantResponse> {
    return this.updateParticipant(id, { personalData: { status } as any });
  }

  /**
   * Search participants by name or document
   */
  searchParticipants(searchTerm: string): Observable<ParticipantListResponse> {
    return this.getParticipants({ search: searchTerm });
  }

  /**
   * Get participants by status
   */
  getParticipantsByStatus(status: ParticipantStatus): Observable<ParticipantListResponse> {
    return this.getParticipants({ status });
  }

  /**
   * Validate participant form data
   */
  validateParticipantData(data: ParticipantFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate personal data
    if (!data.personalData.firstName?.trim()) {
      errors.push('First name is required');
    }

    if (!data.personalData.firstLastName?.trim()) {
      errors.push('First last name is required');
    }

    if (!data.personalData.email?.trim()) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(data.personalData.email)) {
      errors.push('Email format is invalid');
    }

    if (!data.personalData.phoneNumber?.trim()) {
      errors.push('Phone number is required');
    } else if (!this.isValidPhoneNumber(data.personalData.phoneNumber)) {
      errors.push('Phone number format is invalid');
    }

    if (!data.personalData.documentNumber?.trim()) {
      errors.push('Document number is required');
    }

    if (!data.personalData.birthDate) {
      errors.push('Birth date is required');
    } else if (!this.isValidAge(data.personalData.birthDate)) {
      errors.push('Participant must be at least 18 years old');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Private validation helpers
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  }

  private isValidAge(birthDate: string): boolean {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age >= 18;
  }

  /**
   * Reset service state
   */
  resetState(): void {
    this.participantsSubject.next([]);
    this.loadingSubject.next(false);
  }

  /**
   * Get current participants array (for synchronous access)
   */
  getCurrentParticipants(): Participant[] {
    return this.participantsSubject.value;
  }

  /**
   * Check if participant exists by document number
   */
  checkParticipantExists(documentNumber: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/check-exists/${documentNumber}`).pipe(
      catchError((error) => {
        console.error('Error checking participant existence:', error);
        return throwError(() => error);
      })
    );
  }
}
