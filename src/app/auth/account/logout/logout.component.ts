import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from 'src/app/shared/ui/default-layout/default-layout.component';

@Component({
  selector: 'app-auth-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  imports: [CommonModule, RouterModule, DefaultLayoutComponent],
  standalone: true,
})
export class LogoutComponent implements OnInit {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Llamar al backend para revocar el refresh token, luego limpiar storage
    this.authenticationService.logoutRemote().subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: () => this.router.navigate(['/auth/login']),
    });
  }
}
