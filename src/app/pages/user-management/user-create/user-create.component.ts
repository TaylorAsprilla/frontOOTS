import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';
import { NgxIntlTelInputModule, SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LanguageService, SupportedLanguage } from '../../../core/services/language.service';
import { CountryService, CountryConfig } from '../../../core/services/country.service';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { UpdateUserRequest } from '../../../core/interfaces/user.interface';
import { UserModel } from '../../../core/models/user.model';
import { DocumentType } from '../../configuration/document-types/document-type.interface';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageTitleComponent, TranslocoModule, NgxIntlTelInputModule],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);
  private readonly languageService = inject(LanguageService);
  private readonly countryService = inject(CountryService);
  private readonly destroy$ = new Subject<void>();

  pageTitle: BreadcrumbItem[] = [];
  userForm!: FormGroup;
  isSubmitting = false;

  // Edit mode state
  isEditMode = false;
  isLoading = false;
  userId?: number;
  originalUser: UserModel | null = null;

  documentTypes: DocumentType[] = [];
  countries: CountryConfig[] = [];
  roles: any[] = [];
  isLookingUpDocument = false;

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  private readonly langToCountry: Record<SupportedLanguage, CountryISO> = {
    'es-CO': CountryISO.Colombia,
    'es-PR': CountryISO.PuertoRico,
    en: CountryISO.UnitedStates,
  };
  defaultPhoneCountry: CountryISO = CountryISO.Colombia;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && !isNaN(Number(idParam))) {
      this.isEditMode = true;
      this.userId = Number(idParam);
    }

    this.resolveDefaultPhoneCountry();
    this.setupPageTitle();
    this.loadDocumentTypesFromResolver();
    this.loadCountries();
    this.loadRoles();
    this.initializeForm();

    if (this.isEditMode) {
      this.loadUser();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private resolveDefaultPhoneCountry(): void {
    const activeLang = this.languageService.currentLanguage as SupportedLanguage;
    this.defaultPhoneCountry = this.langToCountry[activeLang] ?? CountryISO.Colombia;
    this.languageService.currentLanguage$.pipe(takeUntil(this.destroy$)).subscribe((lang) => {
      this.defaultPhoneCountry = this.langToCountry[lang] ?? CountryISO.Colombia;
    });
  }

  private setupPageTitle(): void {
    if (this.isEditMode) {
      this.pageTitle = [
        { label: 'Gestión de usuarios', path: '/users' },
        { label: 'Usuarios', path: '/users/details' },
        { label: 'Editar usuario', path: '', active: true },
      ];
    } else {
      this.pageTitle = [
        { label: 'User Management', path: '/users' },
        { label: 'Users', path: '/users/list' },
        { label: 'Create User', path: '/users/create', active: true },
      ];
    }
  }

  private loadDocumentTypesFromResolver(): void {
    const resolvedData = this.route.snapshot.data['documentTypes'];
    if (resolvedData && resolvedData.statusCode === 200) {
      this.documentTypes = resolvedData.data;
    } else {
      this.documentTypes = [];
    }
  }

  private loadCountries(): void {
    this.countries = this.countryService.getAvailableCountries();
  }

  private loadRoles(): void {
    this.userService
      .getRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (roles) => { this.roles = roles; },
        error: (error) => { console.error('Error loading roles:', error); },
      });
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      mitaNumber: ['', [Validators.maxLength(50)]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      secondName: ['', [Validators.maxLength(50)]],
      firstLastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      secondLastName: ['', [Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(20)]],
      documentNumber: ['', [Validators.required, Validators.minLength(6)]],
      documentTypeId: [null, [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      countryId: [null, [Validators.required]],
      birthDate: ['', [Validators.required]],
      position: ['', [Validators.required, Validators.maxLength(100)]],
      headquarters: ['', [Validators.required, Validators.maxLength(100)]],
      roleId: [null, [Validators.required]],
    });
  }

  private loadUser(): void {
    this.isLoading = true;
    this.userService
      .getUserById(this.userId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user: UserModel) => {
          this.originalUser = user;
          this.fillFormFromUser(user);
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.router.navigate(['/users/details']);
        },
      });
  }

  private fillFormFromUser(user: UserModel): void {
    const birthDateStr = user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '';
    this.userForm.patchValue({
      mitaNumber: (user as any).mitaNumber ?? '',
      firstName: user.firstName ?? '',
      secondName: user.secondName ?? '',
      firstLastName: user.firstLastName ?? '',
      secondLastName: user.secondLastName ?? '',
      email: user.email ?? '',
      phoneNumber: user.phoneNumber ?? '',
      documentNumber: user.documentNumber ?? '',
      documentTypeId: user.documentTypeId ?? null,
      address: user.address ?? '',
      city: user.city ?? '',
      countryId: (user as any).countryId ?? null,
      birthDate: birthDateStr,
      position: user.position ?? '',
      headquarters: (user as any).headquarters ?? '',
      roleId: (user as any).roleId ?? null,
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      const formValue = this.userForm.value;

      const phoneNumber =
        typeof formValue.phoneNumber === 'string'
          ? formValue.phoneNumber.trim()
          : formValue.phoneNumber?.internationalNumber;

      if (this.isEditMode) {
        const payload: UpdateUserRequest = {
          firstName: formValue.firstName?.trim(),
          secondName: formValue.secondName?.trim() || undefined,
          firstLastName: formValue.firstLastName?.trim(),
          secondLastName: formValue.secondLastName?.trim() || undefined,
          email: formValue.email?.trim().toLowerCase(),
          phoneNumber,
          documentNumber: formValue.documentNumber?.trim(),
          documentTypeId: formValue.documentTypeId,
          address: formValue.address?.trim(),
          city: formValue.city?.trim(),
          countryId: formValue.countryId,
          birthDate: formValue.birthDate,
          position: formValue.position?.trim(),
          headquarters: formValue.headquarters?.trim(),
          roleId: formValue.roleId,
          mitaNumber: formValue.mitaNumber?.trim() || undefined,
        };

        this.userService
          .updateUser(this.userId!, payload)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService
                .showSuccess('Usuario actualizado exitosamente', { title: '¡Éxito!', timer: 2000 })
                .then(() => { this.router.navigate(['/users/details']); });
              this.isSubmitting = false;
            },
            error: (error) => { this.handleSubmitError(error, true); },
          });
      } else {
        const registerRequest = {
          firstName: formValue.firstName?.trim(),
          secondName: formValue.secondName?.trim() || null,
          firstLastName: formValue.firstLastName?.trim(),
          secondLastName: formValue.secondLastName?.trim() || null,
          email: formValue.email?.trim().toLowerCase(),
          phoneNumber,
          documentNumber: formValue.documentNumber?.trim(),
          documentTypeId: formValue.documentTypeId,
          address: formValue.address?.trim(),
          city: formValue.city?.trim(),
          countryId: formValue.countryId,
          birthDate: formValue.birthDate,
          position: formValue.position?.trim(),
          headquarters: formValue.headquarters?.trim(),
          roleId: formValue.roleId,
          mitaNumber: formValue.mitaNumber?.trim() || null,
        };

        this.userService
          .registerUser(registerRequest)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (user: any) => {
              this.notificationService
                .showSuccess('Usuario registrado exitosamente', {
                  title: '¡Éxito!',
                  text: (user.firstName + ' ' + user.firstLastName + ' ha sido registrado correctamente.'),
                  timer: 2000,
                })
                .then(() => { this.router.navigate(['/users/details']); });
              this.isSubmitting = false;
            },
            error: (error) => { this.handleSubmitError(error, false); },
          });
      }
    } else {
      this.markFormGroupTouched();
      this.notificationService.showWarning('Por favor completa todos los campos requeridos correctamente.', {
        title: 'Formulario incompleto',
        timer: 4000,
      });
    }
  }

  private handleSubmitError(error: any, isEdit: boolean): void {
    this.isSubmitting = false;
    const status: number = error?.status ?? 0;
    const action = isEdit ? 'actualizar' : 'registrar';

    let errorTitle = ('Error al ' + action + ' usuario');
    if (status === 409) errorTitle = ('Conflicto al ' + action + ' usuario');
    else if (status === 400 || status === 422) errorTitle = 'Datos inválidos';
    else if (status === 500) errorTitle = 'Error del servidor';

    let errorMessage: string;
    if (Array.isArray(error)) {
      errorMessage = (error as string[]).map((m) => '• ' + m).join('<br>');
    } else {
      const rawMessages = error?.error?.message ?? error?.message;
      if (rawMessages) {
        errorMessage = Array.isArray(rawMessages)
          ? (rawMessages as string[]).map((m) => '• ' + m).join('<br>')
          : String(rawMessages);
      } else {
        errorMessage = ('Ocurrió un error al intentar ' + action + ' el usuario. Por favor intente nuevamente.');
      }
    }

    this.notificationService.showError(errorMessage, { title: errorTitle, timer: 0, showConfirmButton: true });
  }

  onCancel(): void {
    const targetRoute = this.isEditMode ? '/users/details' : '/users/list';
    const title = this.isEditMode ? '¿Cancelar edición?' : '¿Cancelar creación?';
    const text = this.isEditMode
      ? 'Se perderán los cambios no guardados. ¿Estás seguro de que deseas cancelar?'
      : 'Se perderán todos los datos ingresados. ¿Estás seguro de que deseas cancelar?';

    if (this.userForm.dirty) {
      this.notificationService
        .showConfirmation(text, {
          title,
          confirmButtonText: 'Sí, cancelar',
          cancelButtonText: 'Continuar editando',
        })
        .then((result) => { if (result.isConfirmed) { this.router.navigate([targetRoute]); } });
    } else {
      this.router.navigate([targetRoute]);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach((key) => { this.userForm.get(key)?.markAsTouched(); });
  }

  onPhoneBlur(event: FocusEvent): void {
    const wrapper = event.currentTarget as HTMLElement;
    if (!wrapper.contains(event.relatedTarget as Node)) { this.validatePhoneNumber(); }
  }

  validatePhoneNumber(): void {
    const phoneControl = this.userForm.get('phoneNumber');
    const value = phoneControl?.value;
    if (value && phoneControl?.valid) {
      const internationalNumber =
        typeof value === 'string' ? value : ((value.internationalNumber as string) ?? '');
      if (!internationalNumber) return;
      // Skip uniqueness check if the number has not changed in edit mode
      if (this.isEditMode && internationalNumber === this.originalUser?.phoneNumber) return;
      this.userService
        .checkPhoneExists(internationalNumber)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (exists) => {
            if (phoneControl) {
              if (exists) { phoneControl.setErrors({ phoneExists: true }); }
              else if (phoneControl.hasError('phoneExists')) {
                const errors = { ...phoneControl.errors }; delete errors['phoneExists'];
                phoneControl.setErrors(Object.keys(errors).length ? errors : null);
              }
            }
          },
          error: (error) => { console.error('Error checking phone existence:', error); },
        });
    }
  }

  validateEmail(): void {
    const emailControl = this.userForm.get('email');
    const value = emailControl?.value;
    // Skip uniqueness check if the email has not changed in edit mode
    if (value && emailControl?.valid && !(this.isEditMode && value === this.originalUser?.email)) {
      this.userService
        .checkEmailExists(value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (exists) => {
            if (emailControl) {
              if (exists) { emailControl.setErrors({ emailExists: true }); }
              else if (emailControl.hasError('emailExists')) {
                const errors = { ...emailControl.errors }; delete errors['emailExists'];
                emailControl.setErrors(Object.keys(errors).length ? errors : null);
              }
            }
          },
          error: (error) => { console.error('Error checking email existence:', error); },
        });
    }
  }

  validateMitaNumber(): void {
    const mitaControl = this.userForm.get('mitaNumber');
    const value = mitaControl?.value?.trim();
    if (value) {
      this.isLookingUpDocument = true;
      this.userService
        .lookupMitaExternal(value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isLookingUpDocument = false;
            if (!response) return;
            if (response.ok && response.usuario) { this.fillFormFromExternal(response.usuario); return; }
            const status = response._httpStatus;
            if (status === 404) {
              this.notificationService.showWarning(response.msg ?? 'No se encontró ningún usuario con ese número Mita.', { title: 'Usuario no encontrado', timer: 4000 });
            } else if (status === 400) {
              console.warn('Búsqueda por Mita (400):', response.msg);
            } else if (status === 500) {
              this.notificationService.showWarning('Error en el microservicio al buscar por Mita. Los campos deberán llenarse manualmente.', { title: 'Error del servidor externo', timer: 5000 });
            }
          },
          error: () => { this.isLookingUpDocument = false; },
        });
    }
  }

  validateDocumentNumber(): void {
    const documentControl = this.userForm.get('documentNumber');
    const value = documentControl?.value;
    if (value && value.length >= 6) {
      // Skip uniqueness check if document number has not changed in edit mode
      if (!(this.isEditMode && value === this.originalUser?.documentNumber)) {
        this.checkDocumentExists(value);
      }
      this.lookupExternalDocument(value);
    }
  }

  private lookupExternalDocument(documentNumber: string): void {
    const countryId = this.userForm.get('countryId')?.value || undefined;
    this.isLookingUpDocument = true;
    this.userService
      .lookupDocumentExternal(documentNumber, countryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLookingUpDocument = false;
          if (!response) return;
          if (response.ok && response.usuario) { this.fillFormFromExternal(response.usuario); return; }
          const status = response._httpStatus;
          if (status === 404) {
            this.notificationService.showWarning(response.msg ?? 'No se encontró ningún usuario con ese número de documento.', { title: 'Usuario no encontrado', timer: 4000 });
          } else if (status === 400) {
            console.warn('Búsqueda por documento (400):', response.msg);
          } else if (status === 500) {
            this.notificationService.showWarning('Error en el microservicio al buscar el documento. Los campos deberán llenarse manualmente.', { title: 'Error del servidor externo', timer: 5000 });
          }
        },
        error: () => { this.isLookingUpDocument = false; },
      });
  }

  private fillFormFromExternal(usuario: any): void {
    const patch: Record<string, any> = {};
    if (usuario.numeroDocumento) patch['documentNumber'] = usuario.numeroDocumento;
    if (usuario.primerNombre) patch['firstName'] = usuario.primerNombre;
    if (usuario.segundoNombre) patch['secondName'] = usuario.segundoNombre;
    if (usuario.primerApellido) patch['firstLastName'] = usuario.primerApellido;
    if (usuario.segundoApellido) patch['secondLastName'] = usuario.segundoApellido;
    if (usuario.email) patch['email'] = usuario.email;
    if (usuario.numeroCelular) patch['phoneNumber'] = usuario.numeroCelular;
    if (usuario.direccion) patch['address'] = usuario.direccion;
    if (usuario.ciudadDireccion) patch['city'] = usuario.ciudadDireccion;
    if (usuario.fechaNacimiento) patch['birthDate'] = usuario.fechaNacimiento;
    if (usuario.paisDireccion) {
      const matchedCountry = this.countries.find((c) => c.name.toLowerCase() === (usuario.paisDireccion as string).toLowerCase());
      if (matchedCountry?.id) patch['countryId'] = matchedCountry.id;
    }
    this.userForm.patchValue(patch);
    Object.keys(patch).forEach((key) => this.userForm.get(key)?.markAsDirty());
  }

  private checkDocumentExists(documentNumber: string): void {
    this.userService
      .checkDocumentExists(documentNumber)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (exists) => {
          const documentControl = this.userForm.get('documentNumber');
          if (documentControl) {
            if (exists) { documentControl.setErrors({ documentExists: true }); }
            else if (documentControl.hasError('documentExists')) {
              const errors = { ...documentControl.errors }; delete errors['documentExists'];
              documentControl.setErrors(Object.keys(errors).length ? errors : null);
            }
          }
        },
        error: (error) => { console.error('Error checking document existence:', error); },
      });
  }

  getFieldError(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (control && control.errors && control.touched) {
      const errors = control.errors;
      if (errors['required']) return 'user.validation.required';
      if (errors['email']) return 'user.validation.invalidEmail';
      if (errors['emailExists']) return 'user.validation.emailExists';
      if (errors['phoneExists']) return 'user.validation.phoneExists';
      if (errors['minlength']) return 'user.validation.minLength';
      if (errors['maxlength']) return 'user.validation.maxLength';
      if (errors['documentExists']) return 'user.validation.documentExists';
    }
    return '';
  }
}
