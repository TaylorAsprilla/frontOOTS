import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthenticationService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'oots-colombia';

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    // Validar token al iniciar la aplicación si existe
    this.validateExistingToken();
  }

  /**
   * Valida el token existente al cargar la aplicación
   * Obtiene datos completos del usuario si el token es válido
   */
  private validateExistingToken(): void {
    if (this.authService.isAuthenticated() && !this.authService.isTokenExpired()) {
      this.authService.validateToken().subscribe({
        next: (completeUser) => {
          console.log('Token validado exitosamente. Usuario completo:', completeUser);
        },
        error: (error) => {
          console.warn('Error al validar token existente:', error);
          // El servicio ya maneja el logout automático en caso de error 401
        },
      });
    }
  }
}
