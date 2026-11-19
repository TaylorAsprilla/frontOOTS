import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { JoyrideModule } from 'ngx-joyride';
import { Subject, takeUntil } from 'rxjs';

import { AuthenticationService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { UpdateProfileDto } from '../../../core/interfaces/auth.interface';
import {
  AVATAR_ACCEPTED_TYPES,
  AVATAR_MAX_SOURCE_MB,
  ProfileAvatarService,
} from '../../../core/services/profile-avatar.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslocoModule, PageTitleComponent, JoyrideModule],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthenticationService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();
  readonly profileAvatar = inject(ProfileAvatarService);
  readonly avatarAccept = AVATAR_ACCEPTED_TYPES.join(',');
  isUploadingAvatar = false;

  profileForm!: FormGroup;
  isSaving = false;
  isLoading = true;

  breadcrumbItems: BreadcrumbItem[] = [{ label: 'profile.title', active: true }];

  ngOnInit(): void {
    this.profileAvatar.ensureLoaded();
    this.buildForm();
    this.loadProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      firstLastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.pattern(/^[\d\s\+\-\(\)]{7,20}$/)]],
      position: ['', [Validators.maxLength(100)]],
      facebook: ['', [Validators.maxLength(200)]],
      twitter: ['', [Validators.maxLength(200)]],
      instagram: ['', [Validators.maxLength(200)]],
      linkedin: ['', [Validators.maxLength(200)]],
      github: ['', [Validators.maxLength(200)]],
    });
  }

  loadProfile(): void {
    this.authService
      .getCurrentUserComplete()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.profileForm.patchValue({
            firstName: user.firstName,
            firstLastName: user.firstLastName,
            phoneNumber: user.phoneNumber,
            position: user.position,
            facebook: user.facebook,
            twitter: user.twitter,
            instagram: user.instagram,
            linkedin: user.linkedin,
            github: user.github,
          });
          this.isLoading = false;
        },
        error: () => {
          // Fallback to stored user data
          const user = this.authService.currentUser();
          if (user) {
            this.profileForm.patchValue({
              firstName: user.firstName,
              firstLastName: user.firstLastName,
            });
          }
          this.isLoading = false;
        },
      });
  }

  onSubmit(): void {
    if (this.profileForm.invalid || this.isSaving) return;

    this.isSaving = true;

    const payload: UpdateProfileDto = {
      firstName: this.profileForm.value.firstName?.trim(),
      firstLastName: this.profileForm.value.firstLastName?.trim(),
      phoneNumber: this.profileForm.value.phoneNumber?.trim() || undefined,
      position: this.profileForm.value.position?.trim() || undefined,
      facebook: this.profileForm.value.facebook?.trim() || undefined,
      twitter: this.profileForm.value.twitter?.trim() || undefined,
      instagram: this.profileForm.value.instagram?.trim() || undefined,
      linkedin: this.profileForm.value.linkedin?.trim() || undefined,
      github: this.profileForm.value.github?.trim() || undefined,
    };

    this.authService
      .updateProfile(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Perfil actualizado exitosamente');
          this.profileForm.markAsPristine();
          this.isSaving = false;
        },
        error: () => {
          this.notificationService.showError('No se pudo actualizar el perfil. Intenta de nuevo.');
          this.isSaving = false;
        },
      });
  }

  async onAvatarSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || this.isUploadingAvatar) return;

    if (!AVATAR_ACCEPTED_TYPES.includes(file.type)) {
      this.notificationService.showWarning('Formato no permitido. Use una imagen JPG, PNG o WebP');
      return;
    }
    if (file.size > AVATAR_MAX_SOURCE_MB * 1024 * 1024) {
      this.notificationService.showWarning(`La imagen supera los ${AVATAR_MAX_SOURCE_MB} MB`);
      return;
    }

    this.isUploadingAvatar = true;
    try {
      const prepared = await this.profileAvatar.prepare(file);
      this.profileAvatar
        .upload(prepared)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isUploadingAvatar = false;
            this.notificationService.showSuccess('Foto de perfil actualizada');
          },
          error: (error) => {
            this.isUploadingAvatar = false;
            this.notificationService.showError(error?.error?.message || 'No fue posible actualizar la foto');
          },
        });
    } catch {
      this.isUploadingAvatar = false;
      this.notificationService.showError('No fue posible procesar la imagen seleccionada');
    }
  }

  removeAvatar(): void {
    if (this.isUploadingAvatar || !window.confirm('¿Quitar su foto de perfil?')) return;
    this.isUploadingAvatar = true;
    this.profileAvatar
      .remove()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isUploadingAvatar = false;
          this.notificationService.showSuccess('Foto de perfil eliminada');
        },
        error: (error) => {
          this.isUploadingAvatar = false;
          this.notificationService.showError(error?.error?.message || 'No fue posible quitar la foto');
        },
      });
  }

  getInitials(): string {
    const first = this.profileForm.value.firstName || '';
    const last = this.profileForm.value.firstLastName || '';
    return ((first[0] ?? '') + (last[0] ?? '')).toUpperCase() || '??';
  }

  isFieldInvalid(field: string): boolean {
    const control = this.profileForm.get(field);
    return !!(control?.invalid && (control.dirty || control.touched));
  }
}
