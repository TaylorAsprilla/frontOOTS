import { Injectable } from '@angular/core';
import { AuthenticatedUser, AuthenticatedUserComplete } from '../interfaces/auth.interface';

/**
 * Servicio para gestionar el almacenamiento del token y datos del usuario
 */
@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly STORAGE_KEY = 'currentUser';

  constructor() {}

  /**
   * Guarda el usuario autenticado en localStorage
   */
  saveUser(user: AuthenticatedUser): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }

  /**
   * Obtiene el usuario autenticado desde localStorage
   */
  getUser(): AuthenticatedUser | AuthenticatedUserComplete | null {
    try {
      const userStr = localStorage.getItem(this.STORAGE_KEY);
      if (!userStr) return null;

      const user = JSON.parse(userStr);

      // Convertir expiresAt de string a Date si es necesario
      if (user.expiresAt && typeof user.expiresAt === 'string') {
        user.expiresAt = new Date(user.expiresAt);
      }

      return user;
    } catch (error) {
      console.error('Error getting user from localStorage:', error);
      return null;
    }
  }

  /**
   * Guarda el usuario completo con todos los datos en localStorage
   */
  saveUserComplete(user: AuthenticatedUserComplete): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving complete user to localStorage:', error);
    }
  }

  /**
   * Obtiene el usuario completo desde localStorage
   */
  getUserComplete(): AuthenticatedUserComplete | null {
    const user = this.getUser();
    // Verificar si tiene todas las propiedades de AuthenticatedUserComplete
    if (user && 'phoneNumber' in user && 'position' in user) {
      return user as AuthenticatedUserComplete;
    }
    return null;
  }

  /**
   * Obtiene solo el token JWT
   */
  getToken(): string | null {
    const user = this.getUser();
    return user?.token || null;
  }

  /**
   * Verifica si el token ha expirado
   */
  isTokenExpired(): boolean {
    const user = this.getUser();
    if (!user || !user.expiresAt) return true;

    const expirationDate = new Date(user.expiresAt);
    const now = new Date();

    return now >= expirationDate;
  }

  /**
   * Verifica si hay un usuario autenticado con token válido
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null && !this.isTokenExpired();
  }

  /**
   * Elimina el usuario autenticado del localStorage
   */
  clearUser(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing user from localStorage:', error);
    }
  }

  /**
   * Obtiene el tiempo restante hasta la expiración en segundos
   */
  getTimeUntilExpiration(): number {
    const user = this.getUser();
    if (!user || !user.expiresAt) return 0;

    const expirationDate = new Date(user.expiresAt);
    const now = new Date();
    const diffMs = expirationDate.getTime() - now.getTime();

    return Math.max(0, Math.floor(diffMs / 1000));
  }

  /**
   * Actualiza solo el token (útil para refresh token)
   */
  updateToken(token: string, expiresIn: number): void {
    const user = this.getUser();
    if (user) {
      user.token = token;
      user.expiresAt = this.calculateExpirationDate(expiresIn);
      this.saveUser(user);
    }
  }

  /**
   * Calcula la fecha de expiración basada en seconds
   */
  private calculateExpirationDate(expiresIn: number): Date {
    const now = new Date();
    return new Date(now.getTime() + expiresIn * 1000);
  }
}
