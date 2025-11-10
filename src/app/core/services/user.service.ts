import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserModel, UserBackendResponse } from '../models/user.model';
import { NotificationService } from './notification.service';
import { ApiResponse, PaginatedUsersResponse, UpdateUserRequest } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly notificationService = inject(NotificationService);
  private readonly apiUrl = `${environment.apiUrl}/users`;
  private readonly apiUrlRegister = `${environment.apiUrl}`;

  /**
   * Registra un nuevo usuario usando el endpoint de autenticación
   * @param user - Datos del usuario a registrar
   * @returns Observable<UserModel>
   */
  registerUser(user: any): Observable<UserModel> {
    // El endpoint espera todos los campos requeridos por el backend
    return this.http.post<any>(`${this.apiUrlRegister}/auth/register`, user).pipe(
      map((response) => {
        // El usuario viene en response.data.user
        if (response && response.data && response.data.user) {
          // Si tienes un método para transformar a UserModel, úsalo aquí
          // return UserModel.fromBackendResponse(response.data.user);
          return response.data.user;
        }
        throw new Error('Respuesta inesperada del backend');
      }),
      catchError((error) => this.handleError(error, 'Error al registrar el usuario'))
    );
  }

  /**
   * Obtiene la lista de todos los usuarios desde el backend real
   * @param page - Número de página (opcional)
   * @param limit - Límite de usuarios por página (opcional)
   * @returns Observable<UserModel[]>
   */
  getUsers(page?: number, limit?: number): Observable<UserModel[]> {
    let params = new HttpParams();

    if (page !== undefined) {
      params = params.set('page', page.toString());
    }

    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }

    // Interface para la respuesta del backend que incluye data, statusCode, message, etc.
    interface GetUsersResponse {
      data: UserBackendResponse[];
      statusCode: number;
      message: string;
      timestamp: string;
      path: string;
    }

    return this.http.get<GetUsersResponse>(this.apiUrl, { params }).pipe(
      map((response) => {
        // Extraer el array de usuarios del campo 'data'
        const usersData = response.data;

        if (!Array.isArray(usersData)) {
          console.warn('Backend response data is not an array:', usersData);
          return [];
        }

        // Transform backend response array to UserModel array
        const users = usersData.map((userResponse) => UserModel.fromBackendResponse(userResponse));

        return users;
      }),
      catchError((error) => this.handleError(error, 'Error al obtener los usuarios'))
    );
  }

  /**
   * Obtiene usuarios con paginación
   * @param page - Número de página
   * @param limit - Límite de usuarios por página
   * @returns Observable<PaginatedUsersResponse>
   */
  getUsersPaginated(page: number = 1, limit: number = 10): Observable<PaginatedUsersResponse> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    return this.http.get<ApiResponse<PaginatedUsersResponse>>(`${this.apiUrl}/paginated`, { params }).pipe(
      map((response) => response.data),
      catchError((error) => this.handleError(error, 'Error al obtener los usuarios paginados'))
    );
  }

  /**
   * Obtiene un usuario por su ID desde el backend
   * @param id - ID del usuario
   * @returns Observable<UserModel>
   */
  getUserById(id: number): Observable<UserModel> {
    // Interface para la respuesta del backend con estructura estándar
    interface GetUserByIdResponse {
      data: UserBackendResponse;
      statusCode: number;
      message: string;
      timestamp: string;
      path: string;
    }

    return this.http.get<GetUserByIdResponse>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        // Transformar la respuesta del backend a UserModel
        const userModel = UserModel.fromBackendResponse(response.data);
        return userModel;
      }),
      catchError((error) => this.handleError(error, 'Error al obtener el usuario'))
    );
  }

  /**
   * Actualiza un usuario existente
   * @param id - ID del usuario
   * @param user - Datos parciales del usuario a actualizar
   * @returns Observable<User>
   */
  updateUser(id: number, user: UpdateUserRequest): Observable<UserModel> {
    return this.http.put<ApiResponse<UserModel>>(`${this.apiUrl}/${id}`, user).pipe(
      map((response) => response.data),
      tap(() => {
        this.notificationService.showSuccess('Usuario actualizado exitosamente');
      }),
      catchError((error) => this.handleError(error, 'Error al actualizar el usuario'))
    );
  }

  /**
   * Elimina un usuario
   * @param id - ID del usuario
   * @returns Observable<void>
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => void 0),
      tap(() => {
        this.notificationService.showSuccess('Usuario eliminado exitosamente');
      }),
      catchError((error) => this.handleError(error, 'Error al eliminar el usuario'))
    );
  }

  /**
   * Busca usuarios por diferentes criterios
   * @param searchTerm - Término de búsqueda
   * @param searchField - Campo en el que buscar ('email', 'firstName', 'lastName', etc.)
   * @returns Observable<User[]>
   */
  searchUsers(searchTerm: string, searchField?: string): Observable<UserModel[]> {
    let params = new HttpParams().set('search', searchTerm);

    if (searchField) {
      params = params.set('field', searchField);
    }

    return this.http.get<ApiResponse<UserModel[]>>(`${this.apiUrl}/search`, { params }).pipe(
      map((response) => response.data),
      catchError((error) => this.handleError(error, 'Error al buscar usuarios'))
    );
  }

  /**
   * Verifica si un email ya está registrado
   * @param email - Email a verificar
   * @returns Observable<boolean>
   */
  checkEmailExists(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);

    return this.http.get<ApiResponse<{ exists: boolean }>>(`${this.apiUrl}/check-email`, { params }).pipe(
      map((response) => response.data.exists),
      catchError((error) => this.handleError(error, 'Error al verificar el email'))
    );
  }

  /**
   * Verifica si un número de documento ya está registrado
   * @param documentNumber - Número de documento a verificar
   * @returns Observable<boolean>
   */
  checkDocumentExists(documentNumber: string): Observable<boolean> {
    const params = new HttpParams().set('documentNumber', documentNumber);

    return this.http.get<ApiResponse<{ exists: boolean }>>(`${this.apiUrl}/check-document`, { params }).pipe(
      map((response) => response.data.exists),
      catchError((error) => this.handleError(error, 'Error al verificar el documento'))
    );
  }

  /**
   * Cambia el estado activo/inactivo de un usuario
   * @param id - ID del usuario
   * @param isActive - Nuevo estado
   * @returns Observable<User>
   */
  toggleUserStatus(id: number, isActive: boolean): Observable<UserModel> {
    return this.http.patch<ApiResponse<UserModel>>(`${this.apiUrl}/${id}/status`, { isActive }).pipe(
      map((response) => response.data),
      tap(() => {
        const status = isActive ? 'activado' : 'desactivado';
        this.notificationService.showSuccess(`Usuario ${status} exitosamente`);
      }),
      catchError((error) => this.handleError(error, 'Error al cambiar el estado del usuario'))
    );
  }

  /**
   * Manejo centralizado de errores
   * @param error - Error de HTTP
   * @param defaultMessage - Mensaje por defecto
   * @returns Observable que emite el error
   */
  private handleError(error: HttpErrorResponse, defaultMessage: string): Observable<never> {
    console.group('UserService Error Details');
    console.error('Error object:', error);
    console.error('Status:', error.status);
    console.error('Status text:', error.statusText);
    console.error('URL:', error.url);
    console.error('Error body:', error.error);
    console.error('Headers:', error.headers);
    console.groupEnd();

    let errorMessage = defaultMessage;

    if (error.error) {
      // Si el backend envía un mensaje de error específico
      if (error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error.errors && Array.isArray(error.error.errors)) {
        // Si hay múltiples errores de validación
        errorMessage = error.error.errors.join(', ');
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      }
    } else if (error.status === 0) {
      errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
    } else if (error.status >= 500) {
      errorMessage = 'Error interno del servidor. Intente nuevamente más tarde.';
    } else if (error.status === 404) {
      errorMessage = 'El recurso solicitado no fue encontrado.';
    } else if (error.status === 401) {
      errorMessage = 'No tiene autorización para realizar esta acción.';
    } else if (error.status === 403) {
      errorMessage = 'No tiene permisos para realizar esta acción.';
    }

    // Mostrar la notificación de error
    this.notificationService.showError(errorMessage);

    // Registrar el error en consola para debugging
    console.error('Error en UserService:', {
      status: error.status,
      message: error.message,
      error: error.error,
      url: error.url,
      timestamp: new Date().toISOString(),
    });

    return throwError(() => error);
  }
}
