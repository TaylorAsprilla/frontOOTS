import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';

import { AuthenticationService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { UpdateProfileDto } from '../../../core/interfaces/auth.interface';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslocoModule, PageTitleComponent],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthenticationService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  profileForm!: FormGroup;
  isSaving = false;
  isLoading = true;

  breadcrumbItems: BreadcrumbItem[] = [{ label: 'profile.title', active: true }];

  ngOnInit(): void {
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
