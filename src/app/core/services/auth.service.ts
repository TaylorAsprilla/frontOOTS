import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { User } from '../models/auth.models';
import {
  LoginRequest,
  LoginResponse,
  AuthenticatedUser,
  AuthError,
  ValidateTokenResponse,
  AuthenticatedUserComplete,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  PasswordResponse,
  UpdateProfileDto,
  UpdateProfileResponse,
} from '../interfaces/auth.interface';
import { TokenStorageService } from './token-storage.service';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) {}

  /**
   * Returns the current authenticated user
   */
  public currentUser(): AuthenticatedUser | null {
    return this.tokenStorage.getUser();
  }

  /**
   * Verifica si el usuario está autenticado
   */
  public isAuthenticated(): boolean {
    return this.tokenStorage.isAuthenticated();
  }

  /**
   * Performs the login authentication with backend API
   * @param email email of user
   * @param password password of user
   */
  login(email: string, password: string): Observable<AuthenticatedUser> {
    const loginData: LoginRequest = { email, password };

    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, loginData).pipe(
      map((response: LoginResponse) => {
        // Extraer datos de la respuesta
        const { data } = response;

        // Calcular fecha de expiración
        const now = new Date();
        const expiresAt = new Date(now.getTime() + data.expires_in * 1000);

        // Crear objeto de usuario autenticado
        const authenticatedUser: AuthenticatedUser = {
          id: data.user.id,
          firstName: data.user.firstName,
          firstLastName: data.user.firstLastName,
          email: data.user.email,
          token: data.access_token,
          tokenType: data.token_type,
          expiresAt: expiresAt,
        };

        // Guardar en localStorage
        this.tokenStorage.saveUser(authenticatedUser);

        return authenticatedUser;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error:', error);

        let errorMessage = 'Error al iniciar sesión. Por favor, intente nuevamente.';

        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.status === 401) {
          errorMessage = 'Credenciales inválidas. Verifique su email y contraseña.';
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión.';
        } else if (error.status >= 500) {
          errorMessage = 'Error en el servidor. Por favor, intente más tarde.';
        }

        return throwError(() => errorMessage);
      })
    );
  }

  /**
   * Performs the signup auth
   * @param name name of user
   * @param email email of user
   * @param password password of user
   */
  signup(name: string, email: string, password: string): any {
    return this.http.post<any>(`${this.API_URL}/auth/signup`, { name, email, password }).pipe(map((user) => user));
  }

  /**
   * Logout the user and clear stored data
   */
  logout(): void {
    this.tokenStorage.clearUser();
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return this.tokenStorage.getToken();
  }

  /**
   * Verifica si el token ha expirado
   */
  isTokenExpired(): boolean {
    return this.tokenStorage.isTokenExpired();
  }

  /**
   * Valida el token actual y obtiene datos completos del usuario
   * @returns Observable con datos completos del usuario autenticado
   */
  validateToken(): Observable<AuthenticatedUserComplete> {
    const currentUser = this.tokenStorage.getUser();

    if (!currentUser || !currentUser.token) {
      return throwError(() => 'No hay token disponible para validar');
    }

    // El token se envía automáticamente por el AuthInterceptor
    return this.http.post<ValidateTokenResponse>(`${this.API_URL}/auth/validate`, {}).pipe(
      map((response: ValidateTokenResponse) => {
        if (!response.data.valid) {
          throw new Error('Token inválido');
        }

        const { user } = response.data;

        // Crear usuario completo con token existente
        const completeUser: AuthenticatedUserComplete = {
          ...user,
          token: currentUser.token,
          tokenType: currentUser.tokenType,
          expiresAt: currentUser.expiresAt,
        };

        // Actualizar datos almacenados con información completa
        this.tokenStorage.saveUserComplete(completeUser);

        return completeUser;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Token validation error:', error);

        let errorMessage = 'Error al validar el token.';

        if (error.status === 401) {
          errorMessage = 'Token inválido o expirado.';
          this.logout(); // Logout automático si el token no es válido
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor.';
        } else if (error.status >= 500) {
          errorMessage = 'Error en el servidor.';
        }

        return throwError(() => errorMessage);
      })
    );
  }

  /**
   * Obtiene los datos completos del usuario actual desde el servidor
   */
  getCurrentUserComplete(): Observable<AuthenticatedUserComplete> {
    return this.validateToken();
  }

  // ==================== PASSWORD MANAGEMENT METHODS ====================

  /**
   * Cambiar contraseña del usuario autenticado
   * @param payload Datos para cambiar la contraseña
   * @returns Observable con la respuesta del servidor
   */
  changePassword(payload: ChangePasswordDto): Observable<PasswordResponse> {
    return this.http.patch<PasswordResponse>(`${this.API_URL}/auth/change-password`, payload).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Change password error:', error);

        let errorMessage = 'Error al cambiar la contraseña. Por favor, intente nuevamente.';

        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.status === 400) {
          errorMessage = 'Datos inválidos. Verifique que las contraseñas coincidan.';
        } else if (error.status === 401) {
          errorMessage = 'La contraseña actual es incorrecta.';
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión.';
        } else if (error.status >= 500) {
          errorMessage = 'Error en el servidor. Por favor, intente más tarde.';
        }

        return throwError(() => errorMessage);
      })
    );
  }

  /**
   * Solicitar recuperación de contraseña (envía email)
   * @param payload Email del usuario
   * @returns Observable con la respuesta del servidor
   */
  forgotPassword(payload: ForgotPasswordDto): Observable<PasswordResponse> {
    return this.http.post<PasswordResponse>(`${this.API_URL}/auth/forgot-password`, payload).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Forgot password error:', error);

        let errorMessage = 'Error al procesar la solicitud. Por favor, intente nuevamente.';

        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.status === 404) {
          // Por seguridad, no revelamos si el email existe o no
          errorMessage = 'Si el correo está registrado, recibirás las instrucciones para recuperar tu contraseña.';
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión.';
        } else if (error.status >= 500) {
          errorMessage = 'Error en el servidor. Por favor, intente más tarde.';
        }

        return throwError(() => errorMessage);
      })
    );
  }

  /**
   * Restablecer contraseña con token
   * @param payload Token y nueva contraseña
   * @returns Observable con la respuesta del servidor
   */
  resetPassword(payload: ResetPasswordDto): Observable<PasswordResponse> {
    return this.http.post<PasswordResponse>(`${this.API_URL}/auth/reset-password`, payload).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Reset password error:', error);

        let errorMessage = 'Error al restablecer la contraseña. Por favor, intente nuevamente.';

        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.status === 400) {
          errorMessage = 'Datos inválidos. Verifique que las contraseñas coincidan.';
        } else if (error.status === 401 || error.status === 403) {
          errorMessage = 'El enlace de recuperación ha expirado o es inválido. Solicite uno nuevo.';
        } else if (error.status === 404) {
          errorMessage = 'Token no encontrado. Por favor, solicite un nuevo enlace de recuperación.';
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión.';
        } else if (error.status >= 500) {
          errorMessage = 'Error en el servidor. Por favor, intente más tarde.';
        }

        return throwError(() => errorMessage);
      })
    );
  }

  /**
   * Actualizar perfil del usuario autenticado
   * @param payload Datos del perfil a actualizar
   * @returns Observable con el perfil actualizado
   */
  updateProfile(payload: UpdateProfileDto): Observable<UpdateProfileResponse> {
    return this.http.patch<UpdateProfileResponse>(`${this.API_URL}/auth/profile`, payload).pipe(
      map((response: UpdateProfileResponse) => {
        // Actualizar el usuario en el storage si hay cambios en nombre o email
        const currentUser = this.currentUser();
        if (currentUser) {
          const updatedUser: AuthenticatedUser = {
            ...currentUser,
            firstName: payload.firstName || currentUser.firstName,
            firstLastName: payload.firstLastName || currentUser.firstLastName,
          };
          this.tokenStorage.saveUser(updatedUser);
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Update profile error:', error);

        let errorMessage = 'Error al actualizar el perfil. Por favor, intente nuevamente.';

        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.status === 400) {
          errorMessage = 'Datos inválidos. Verifique la información ingresada.';
        } else if (error.status === 401) {
          errorMessage = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
        } else if (error.status === 409) {
          errorMessage = 'El correo electrónico ya está en uso por otro usuario.';
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión.';
        } else if (error.status >= 500) {
          errorMessage = 'Error en el servidor. Por favor, intente más tarde.';
        }

        return throwError(() => errorMessage);
      })
    );
  }
}
