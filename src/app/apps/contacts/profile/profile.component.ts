import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';
import { MemberInfo } from '../shared/contacts.model';
import { MEMBERLIST } from '../shared/data';
import { SettingsComponent } from './settings/settings.component';
import { UserboxComponent } from './userbox/userbox.component';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-contact-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule, PageTitleComponent, SettingsComponent, UserboxComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  selectedMember!: MemberInfo;
  isLoading = true;

  constructor(private route: ActivatedRoute, private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Mi Cuenta', path: '/', active: true }];

    // Cargar datos del usuario autenticado actual desde la API
    this._loadCurrentUserProfile();
  }

  /**
   * Load current authenticated user profile from API
   */
  _loadCurrentUserProfile(): void {
    this.isLoading = true;

    this.authService.validateToken().subscribe({
      next: (user) => {
        // Mapear datos del usuario completo al formato MemberInfo
        this.selectedMember = {
          id: user.id,
          name: `${user.firstName} ${user.firstLastName}`,
          email: user.email,
          phoneNumber: user.phoneNumber || '',
          avatar: 'assets/images/users/user-1.jpg', // Avatar por defecto
          position: user.position || 'Usuario',
          website: '',
          posts: '0',
          followers: '0',
          followings: '0',
          facebook: user.facebook || '',
          twitter: user.twitter || '',
          instagram: user.instagram || '',
          linkedin: user.linkedin || '',
          github: user.github || '',
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.isLoading = false;

        // Fallback: usar datos básicos del currentUser
        const currentUser = this.authService.currentUser();
        if (currentUser) {
          this.selectedMember = {
            id: currentUser.id,
            name: `${currentUser.firstName} ${currentUser.firstLastName}`,
            email: currentUser.email,
            avatar: 'assets/images/users/user-1.jpg',
            position: 'Usuario',
            website: '',
            posts: '0',
            followers: '0',
            followings: '0',
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: '',
            github: '',
          };
        } else {
          this.selectedMember = MEMBERLIST[0];
        }
      },
    });
  }

  /**
   * Handle profile update event
   */
  onProfileUpdated(): void {
    // Recargar los datos del perfil después de actualizar
    this._loadCurrentUserProfile();
  }
}
