import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { MemberInfo } from '../../shared/contacts.model';
import { UpdateProfileDto } from 'src/app/core/interfaces/auth.interface';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnChanges {
  @Input() member?: MemberInfo;
  @Output() profileUpdated = new EventEmitter<void>();

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  //profile form
  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phoneNumber: [''],
    position: [''],
    facebook: [''],
    twitter: [''],
    instagram: [''],
    linkedin: [''],
    github: [''],
  });

  constructor(private fb: FormBuilder, private authService: AuthenticationService) {}

  ngOnInit(): void {
    this._loadUserData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['member'] && !changes['member'].firstChange) {
      this._loadUserData();
    }
  }

  /**
   * Load user data into form
   */
  _loadUserData(): void {
    if (this.member) {
      const names = this.member.name?.split(' ') || ['', ''];
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';

      this.profileForm.patchValue({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: this.member.phoneNumber || '',
        position: this.member.position || '',
        facebook: this.member.facebook || '',
        twitter: this.member.twitter || '',
        instagram: this.member.instagram || '',
        linkedin: this.member.linkedin || '',
        github: this.member.github || '',
      });
    }
  }

  /**
   * Save profile changes
   */
  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const payload: UpdateProfileDto = {
        firstName: this.profileForm.value.firstName || undefined,
        firstLastName: this.profileForm.value.lastName || undefined,
        phoneNumber: this.profileForm.value.phoneNumber || undefined,
        position: this.profileForm.value.position || undefined,
        facebook: this.profileForm.value.facebook || undefined,
        twitter: this.profileForm.value.twitter || undefined,
        instagram: this.profileForm.value.instagram || undefined,
        linkedin: this.profileForm.value.linkedin || undefined,
        github: this.profileForm.value.github || undefined,
      };

      // Remover campos undefined
      Object.keys(payload).forEach((key) => {
        if (payload[key as keyof UpdateProfileDto] === undefined) {
          delete payload[key as keyof UpdateProfileDto];
        }
      });

      this.authService.updateProfile(payload).subscribe({
        next: (response) => {
          console.log('Profile updated successfully', response);
          this.isLoading = false;
          this.successMessage = 'Perfil actualizado exitosamente';
          this.profileUpdated.emit();

          // Limpiar mensaje de éxito después de 3 segundos
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error('Error updating profile', error);
          this.isLoading = false;
          this.errorMessage = error;
        },
      });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos requeridos';
    }
  }
}
