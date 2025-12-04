import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbNavModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';
import { NgxIntlTelInputModule, SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { ParticipantService } from '../../../core/services/participant.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { ParticipantFormData, ValidationMessages } from '../../../core/interfaces/participant.interface';
import { CaseService } from '../../../core/services/case.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { DocumentType } from '../../configuration/document-types/document-type.interface';
import { Gender } from '../../configuration/genders/gender.interface';
import { MaritalStatus } from '../../configuration/marital-status/marital-status.interface';
import { HealthInsurance } from '../../configuration/health-insurance/health-insurance.interface';
import { FamilyRelationship } from '../../configuration/family-relationship/family-relationship.interface';
import { IncomeSource } from '../../configuration/income-source/income-source.interface';
import { IncomeLevel } from '../../configuration/income-level/income-level.interface';
import { HousingType } from '../../configuration/housing-type/housing-type.interface';
import { AcademicLevel } from '../../../core/interfaces/academic-level.interface';
import { CountryService } from '../../../core/services/country.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-create-participant',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbProgressbarModule,
    TranslocoModule,
    PageTitleComponent,
    NgxIntlTelInputModule,
  ],
  templateUrl: './create-participant.component.html',
  styleUrls: ['./create-participant.component.scss'],
})
export class CreateParticipantComponent implements OnInit, OnDestroy {
  private readonly caseService = inject(CaseService);
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly route = inject(ActivatedRoute);
  private readonly countryService = inject(CountryService);
  participantId: number | null = null;
  private readonly formBuilder = inject(FormBuilder);
  private readonly participantService = inject(ParticipantService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  // Form and wizard state
  participantForm!: FormGroup;
  activeWizardStep: number = 1;
  isLoading = false;
  isSubmitting = false;

  // Document Types from resolver
  documentTypes: DocumentType[] = [];

  // Genders from resolver
  genders: Gender[] = [];

  // Marital Statuses from resolver
  maritalStatuses: MaritalStatus[] = [];

  // Health Insurances from resolver
  healthInsurances: HealthInsurance[] = [];

  // Family Relationships from resolver
  familyRelationships: FamilyRelationship[] = [];

  // Income Sources from resolver
  incomeSources: IncomeSource[] = [];

  // Income Levels from resolver
  incomeLevels: IncomeLevel[] = [];

  // Housing Types from resolver
  housingTypes: HousingType[] = [];

  // Academic Levels from resolver
  academicLevels: AcademicLevel[] = [];

  // Expose enums for template
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  // Preferred countries from environment
  preferredCountries: CountryISO[] = [];

  // Breadcrumb configuration
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'participants.title', active: false },
    { label: 'participants.create', active: true },
  ];

  // Validation messages
  validationMessages: ValidationMessages = {
    personalData: {
      firstName: 'participants.validation.firstNameRequired',
      firstLastName: 'participants.validation.firstLastNameRequired',
      email: 'participants.validation.emailRequired',
      phoneNumber: 'participants.validation.phoneRequired',
      documentNumber: 'participants.validation.documentRequired',
      birthDate: 'participants.validation.birthDateRequired',
      emergencyContactName: 'participants.validation.emergencyContactNameRequired',
      emergencyContactPhone: 'participants.validation.emergencyContactPhoneRequired',
      emergencyContactEmail: 'participants.validation.emergencyContactEmailRequired',
      emergencyContactAddress: 'participants.validation.emergencyContactAddressRequired',
      city: 'participants.validation.cityRequired',
      state: 'participants.validation.stateRequired',
      emergencyContactCity: 'participants.validation.emergencyContactCityRequired',
      emergencyContactRelationship: 'participants.validation.emergencyContactRelationshipRequired',
      goal: 'participants.validation.goalRequired',
      objectives: 'participants.validation.objectivesRequired',
      activities: 'participants.validation.activitiesRequired',
      timeframe: 'participants.validation.timeframeRequired',
      responsiblePerson: 'participants.validation.responsiblePersonRequired',
      evaluationCriteria: 'participants.validation.evaluationCriteriaRequired',
    },
  };

  ngOnInit(): void {
    this.loadDocumentTypesFromResolver();
    this.loadGendersFromResolver();
    this.loadMaritalStatusesFromResolver();
    this.loadHealthInsurancesFromResolver();
    this.loadFamilyRelationshipsFromResolver();
    this.loadIncomeSourcesFromResolver();
    this.loadIncomeLevelsFromResolver();
    this.loadHousingTypesFromResolver();
    this.loadAcademicLevelsFromResolver();
    this.initializePreferredCountries();
    this.initializeForm();
    this.setupFormSubscriptions();

    // Check if in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.participantId = parseInt(id, 10);
      this.breadcrumbItems = [
        { label: 'participants.title', active: false },
        { label: 'participants.edit', active: true },
      ];
      this.loadParticipantData(this.participantId);
    } else {
      this.isLoading = false;
    }
  }

  /**
   * Initialize preferred countries from environment
   */
  private initializePreferredCountries(): void {
    const envCountries = environment.preferredCountries || ['co', 'us'];
    this.preferredCountries = envCountries.map((code) => {
      const upperCode = code.toUpperCase();
      return CountryISO[upperCode as keyof typeof CountryISO] || CountryISO.Colombia;
    });
  }

  /**
   * Load document types from route resolver
   */
  private loadDocumentTypesFromResolver(): void {
    const resolvedData = this.route.snapshot.data['documentTypes'];
    if (resolvedData && resolvedData.statusCode === 200) {
      this.documentTypes = resolvedData.data;
    } else {
      this.documentTypes = [];
    }
  }

  /**
   * Load genders from route resolver
   */
  private loadGendersFromResolver(): void {
    const resolvedGenders = this.route.snapshot.data['genders'];
    if (resolvedGenders && Array.isArray(resolvedGenders)) {
      this.genders = resolvedGenders;
    } else {
      this.genders = [];
    }
  }

  /**
   * Load marital statuses from route resolver
   */
  private loadMaritalStatusesFromResolver(): void {
    const resolvedData = this.route.snapshot.data['maritalStatuses'];
    if (resolvedData && Array.isArray(resolvedData)) {
      this.maritalStatuses = resolvedData;
    } else {
      this.maritalStatuses = [];
    }
  }

  /**
   * Load health insurances from route resolver
   */
  private loadHealthInsurancesFromResolver(): void {
    const resolvedData = this.route.snapshot.data['healthInsurances'];
    if (resolvedData && Array.isArray(resolvedData)) {
      this.healthInsurances = resolvedData;
    } else {
      this.healthInsurances = [];
    }
  }

  /**
   * Load family relationships from route resolver
   */
  private loadFamilyRelationshipsFromResolver(): void {
    const resolvedData = this.route.snapshot.data['familyRelationships'];
    if (resolvedData && Array.isArray(resolvedData)) {
      this.familyRelationships = resolvedData;
    } else {
      this.familyRelationships = [];
    }
  }

  /**
   * Load income sources from route resolver
   */
  private loadIncomeSourcesFromResolver(): void {
    const resolvedData = this.route.snapshot.data['incomeSources'];
    if (resolvedData && Array.isArray(resolvedData)) {
      this.incomeSources = resolvedData;
    } else {
      this.incomeSources = [];
    }
  }

  /**
   * Load income levels from route resolver
   */
  private loadIncomeLevelsFromResolver(): void {
    const resolvedData = this.route.snapshot.data['incomeLevels'];
    if (resolvedData && Array.isArray(resolvedData)) {
      this.incomeLevels = resolvedData;
    } else {
      this.incomeLevels = [];
    }
  }

  /**
   * Load housing types from route resolver
   */
  private loadHousingTypesFromResolver(): void {
    const resolvedData = this.route.snapshot.data['housingTypes'];
    if (resolvedData && Array.isArray(resolvedData)) {
      this.housingTypes = resolvedData;
    } else {
      this.housingTypes = [];
    }
  }

  /**
   * Load academic levels from route resolver
   */
  private loadAcademicLevelsFromResolver(): void {
    const resolvedData = this.route.snapshot.data['academicLevels'];
    if (resolvedData && Array.isArray(resolvedData)) {
      this.academicLevels = resolvedData;
    } else {
      this.academicLevels = [];
    }
  }

  /**
   * Load participant data for editing
   */
  private loadParticipantData(id: number): void {
    this.isLoading = true;
    this.participantService
      .getParticipantById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const participant = response.data;

          // Populate personal data with emergency contact (only first one)
          const emergencyContact = participant.emergencyContacts?.[0];

          this.participantForm.get('personalData')?.patchValue({
            firstName: participant.firstName,
            secondName: participant.secondName || '',
            firstLastName: participant.firstLastName,
            secondLastName: participant.secondLastName || '',
            phoneNumber: participant.phoneNumber,
            email: participant.email,
            documentTypeId: participant.documentTypeId,
            documentNumber: participant.documentNumber,
            address: participant.address,
            city: participant.city,
            birthDate: participant.birthDate,
            genderId: participant.genderId,
            maritalStatusId: participant.maritalStatusId,
            healthInsuranceId: participant.healthInsuranceId,
            customHealthInsurance: participant.customHealthInsurance || '',
            religiousAffiliation: participant.religiousAffiliation || '',
            referralSource: participant.referralSource || '',
            emergencyContactName: emergencyContact?.emergencyContact?.name || '',
            emergencyContactPhone: emergencyContact?.emergencyContact?.phone || '',
            emergencyContactEmail: emergencyContact?.emergencyContact?.email || '',
            emergencyContactAddress: emergencyContact?.emergencyContact?.address || '',
            emergencyContactCity: emergencyContact?.emergencyContact?.city || '',
            emergencyContactRelationship: emergencyContact?.relationshipId || '',
          });

          // Populate family members
          if (participant.familyMembers && participant.familyMembers.length > 0) {
            const familyCompositionArray = this.participantForm.get('familyComposition') as FormArray;
            familyCompositionArray.clear();

            participant.familyMembers.forEach((member) => {
              familyCompositionArray.push(
                this.formBuilder.group({
                  name: [member.name, Validators.required],
                  birthDate: [member.birthDate, Validators.required],
                  occupation: [member.occupation, Validators.required],
                  relationshipId: [member.familyRelationshipId, Validators.required],
                  academicLevelId: [member.academicLevelId, Validators.required],
                })
              );
            });
          }

          // Populate biopsychosocial history
          if (participant.bioPsychosocialHistory) {
            this.participantForm.get('bioPsychosocialHistory')?.patchValue({
              academicLevelId: participant.bioPsychosocialHistory.academicLevelId,
              completedGrade: participant.bioPsychosocialHistory.completedGrade || '',
              institution: participant.bioPsychosocialHistory.institution || '',
              profession: participant.bioPsychosocialHistory.profession || '',
              incomeLevelId: participant.bioPsychosocialHistory.incomeLevelId,
              incomeSourceId: participant.bioPsychosocialHistory.incomeSourceId,
              occupationalHistory: participant.bioPsychosocialHistory.occupationalHistory || '',
              housingTypeId: participant.bioPsychosocialHistory.housingTypeId,
              housing: participant.bioPsychosocialHistory.housing || '',
            });
          }

          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading participant:', error);
          this.notificationService.showError('Error al cargar los datos del participante');
          this.isLoading = false;
          this.router.navigate(['/participants/list']);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize the reactive form with 3 main sections:
   * 1. Personal Data (Datos Personales)
   * 2. Family Composition (Composición Familiar)
   * 3. Biopsychosocial History (Historial BioPsicosocial)
   */
  private initializeForm(): void {
    this.participantForm = this.formBuilder.group({
      // Step 1: Personal Data
      personalData: this.formBuilder.group({
        firstName: ['', [Validators.required, Validators.maxLength(50)]],
        secondName: ['', Validators.maxLength(50)],
        firstLastName: ['', [Validators.required, Validators.maxLength(50)]],
        secondLastName: ['', Validators.maxLength(50)],
        phoneNumber: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        documentTypeId: ['', Validators.required],
        documentNumber: ['', [Validators.required]],
        address: ['', [Validators.required, Validators.maxLength(200)]],
        city: ['', [Validators.required, Validators.maxLength(50)]],
        state: ['', [Validators.required, Validators.maxLength(50)]],
        zipCode: ['', Validators.maxLength(10)],
        birthDate: ['', [Validators.required, this.validateMinimumAge(11)]],
        religiousAffiliation: [''],
        referralSource: [''],
        genderId: ['', Validators.required],
        maritalStatusId: ['', Validators.required],
        healthInsuranceId: ['', Validators.required],
        customHealthInsurance: [''],
        // Emergency Contact fields
        emergencyContactName: ['', Validators.required],
        emergencyContactPhone: ['', Validators.required],
        emergencyContactEmail: ['', [Validators.required, Validators.email]],
        emergencyContactAddress: ['', Validators.required],
        emergencyContactCity: ['', Validators.required],
        emergencyContactRelationship: ['', Validators.required],
      }),

      // Step 2: Family Composition
      familyComposition: this.formBuilder.array([this.createFamilyMemberForm()]),

      // Step 3: Biopsychosocial History
      bioPsychosocialHistory: this.formBuilder.group({
        academicLevelId: ['', Validators.required],
        completedGrade: ['', Validators.required],
        institution: ['', Validators.required],
        profession: ['', Validators.required],
        incomeSourceId: ['', Validators.required],
        incomeLevelId: ['', Validators.required],
        occupationalHistory: ['', Validators.required],
        housingTypeId: ['', Validators.required],
        housing: ['', Validators.required],
      }),
    });

    // Set up conditional validators
    this.setupConditionalValidators();
  }

  /**
   * Setup form subscriptions for real-time validation and updates
   */
  private setupFormSubscriptions(): void {
    // Listen to loading state from service
    this.participantService.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => (this.isLoading = loading));
  }

  /**
   * Setup conditional validators for dependent fields
   */
  private setupConditionalValidators(): void {
    // Health Insurance custom field validator
    const healthInsuranceControl = this.participantForm.get('personalData.healthInsuranceId');
    const customHealthInsuranceControl = this.participantForm.get('personalData.customHealthInsurance');

    if (healthInsuranceControl && customHealthInsuranceControl) {
      healthInsuranceControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        if (value === 'other') {
          customHealthInsuranceControl.setValidators([Validators.required]);
        } else {
          customHealthInsuranceControl.clearValidators();
        }
        customHealthInsuranceControl.updateValueAndValidity();
      });
    }

    // Follow-up plan next appointment validators
    const scheduleAppointmentControl = this.participantForm.get('followUpPlan.scheduleNextAppointment');
    const nextDateControl = this.participantForm.get('followUpPlan.nextAppointmentDate');
    const nextTimeControl = this.participantForm.get('followUpPlan.nextAppointmentTime');

    if (scheduleAppointmentControl && nextDateControl && nextTimeControl) {
      scheduleAppointmentControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        if (value) {
          nextDateControl.setValidators([Validators.required]);
          nextTimeControl.setValidators([Validators.required]);
        } else {
          nextDateControl.clearValidators();
          nextTimeControl.clearValidators();
        }
        nextDateControl.updateValueAndValidity();
        nextTimeControl.updateValueAndValidity();
      });
    }
  }

  /**
   * Custom validator for minimum age
   */
  private validateMinimumAge(minimumAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age >= minimumAge ? null : { underAge: { requiredAge: minimumAge, currentAge: age } };
    };
  }

  /**
   * Create an empty progress note form group
   */
  private createEmptyProgressNote(): FormGroup {
    return this.formBuilder.group({
      date: ['', Validators.required],
      time: [''],
      approachType: ['', Validators.required], // CP, E, EC, Ll, TC, V
      process: [''], // S, C, T, D
      summary: ['', Validators.required],
      observations: [''],
      agreements: [''],
    });
  }

  /**
   * Add a new progress note
   */
  addProgressNote(): void {
    this.progressNotes.push(this.createEmptyProgressNote());
  }

  /**
   * Remove a progress note by index
   */
  removeProgressNote(index: number): void {
    this.progressNotes.removeAt(index);

    // Ensure at least one progress note exists
    if (this.progressNotes.length === 0) {
      this.addProgressNote();
    }
  }

  /**
   * Getter for progress notes form array
   */
  get progressNotes(): FormArray {
    return this.participantForm.get('progressNotes') as FormArray;
  }

  /**
   * Check if document number already exists when user leaves the field
   */
  onDocumentNumberBlur(): void {
    const documentControl = this.participantForm.get('personalData.documentNumber');
    if (documentControl && documentControl.value) {
      console.log('Document number field lost focus, checking existence...', documentControl);
      const documentNumber = documentControl.value.trim();

      this.checkDocumentExists(documentNumber);
    }
  }

  /**
   * Check if document number already exists
   */
  private checkDocumentExists(documentNumber: string): void {
    this.participantService
      .checkParticipantExists(documentNumber)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const documentControl = this.participantForm.get('personalData.documentNumber');
          if (documentControl) {
            if (response.data.exists) {
              documentControl.setErrors({ documentExists: true, documentNumber: documentNumber });
              documentControl.markAsTouched();
            } else {
              // Limpiar el error de documentExists si ya no existe
              if (documentControl.hasError('documentExists')) {
                const errors = { ...documentControl.errors };
                delete errors['documentExists'];
                delete errors['documentNumber'];
                documentControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
              }
            }
          }
        },
        error: (error) => {
          console.error('Error checking document existence:', error);
        },
      });
  }

  /**
   * Navigate to next wizard step
   */
  goToNextStep(): void {
    if (this.canProceedToNextStep()) {
      this.activeWizardStep++;
    } else {
      this.markCurrentStepAsTouched();
    }
  }

  /**
   * Navigate to previous wizard step
   */
  goToPreviousStep(): void {
    if (this.activeWizardStep > 1) {
      this.activeWizardStep--;
    }
  }

  /**
   * Check if can proceed to next step based on current step validation
   */
  private canProceedToNextStep(): boolean {
    switch (this.activeWizardStep) {
      case 1:
        return this.participantForm.get('personalData')?.valid || false;
      case 2:
        return this.participantForm.get('familyComposition')?.valid || false;
      case 3:
        return this.participantForm.get('bioPsychosocialHistory')?.valid || false;
      case 4:
        return this.participantForm.get('consultationReason')?.valid || false;
      case 5:
        return this.participantForm.get('identifiedSituations')?.valid || false;
      case 6:
        return this.participantForm.get('intervention')?.valid || false;
      case 7:
        return this.participantForm.get('followUpPlan')?.valid || false;
      default:
        return true; // Para pasos sin validación obligatoria
    }
  }

  /**
   * Mark all controls in current step as touched
   */
  private markCurrentStepAsTouched(): void {
    let groupName = '';
    switch (this.activeWizardStep) {
      case 1:
        groupName = 'personalData';
        break;
      case 2:
        groupName = 'familyComposition';
        break;
      case 3:
        groupName = 'bioPsychosocialHistory';
        break;
      case 4:
        groupName = 'consultationReason';
        break;
      case 5:
        groupName = 'identifiedSituations';
        break;
      case 6:
        groupName = 'intervention';
        break;
      case 7:
        groupName = 'followUpPlan';
        break;
      case 8:
        groupName = 'physicalHealthHistory';
        break;
      case 9:
        groupName = 'mentalHealthHistory';
        break;
      case 10:
        groupName = 'assessment';
        break;
      case 11:
        groupName = 'interventionPlan';
        break;
      case 12:
        groupName = 'progressNotes';
        break;
      case 13:
        groupName = 'referrals';
        break;
      case 14:
        groupName = 'closingNote';
        break;
    }

    if (groupName) {
      const group = this.participantForm.get(groupName);
      if (group) {
        this.markFormGroupTouched(group as FormGroup);
      }
    }
  }

  /**
   * Mark all controls in a form group as touched
   */
  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Get error message for a specific field
   */
  getFieldError(fieldPath: string): string {
    const control = this.participantForm.get(fieldPath);
    if (control && control.errors && control.touched) {
      const errors = control.errors;

      if (errors['required']) return 'participants.validation.required';
      if (errors['email']) return 'participants.validation.invalidEmail';
      if (errors['validatePhoneNumber']) return 'participants.validation.invalidPhoneFormat';
      if (errors['pattern']) {
        if (fieldPath.includes('phoneNumber') || fieldPath.includes('Phone')) {
          return 'participants.validation.invalidPhoneFormat';
        }
        return 'participants.validation.invalidFormat';
      }
      if (errors['maxlength']) return 'participants.validation.maxLength';
      if (errors['underAge']) return 'participants.validation.minimumAge';
      if (errors['documentExists']) return 'participants.validation.documentExists';
    }

    return '';
  }

  /**
   * Get the document number from error state
   */
  getDocumentNumberFromError(): string {
    const control = this.participantForm.get('personalData.documentNumber');
    if (control && control.errors && control.errors['documentNumber']) {
      return control.errors['documentNumber'];
    }
    return '';
  }

  /**
   * Check if a field has errors and is touched
   */
  hasFieldError(fieldPath: string): boolean {
    const control = this.participantForm.get(fieldPath);
    return !!(control && control.errors && control.touched);
  }

  /**
   * Submit the form
   */

  onSubmit(): void {
    // Validar que todos los pasos estén completos
    const personalDataValid = this.participantForm.get('personalData')?.valid;
    const familyCompositionValid = this.participantForm.get('familyComposition')?.valid;
    const bioHistoryValid = this.participantForm.get('bioPsychosocialHistory')?.valid;

    if (!personalDataValid || !familyCompositionValid || !bioHistoryValid) {
      this.markFormGroupTouched(this.participantForm);
      this.notificationService.showWarning('Por favor complete todos los campos requeridos');
      return;
    }

    if (this.participantForm.valid && !this.isSubmitting) {
      // Si estamos en el paso 3, crear el participante
      if (this.activeWizardStep === 3) {
        this.confirmSubmission();
      } else {
        // En otros pasos, solo avanzar
        this.goToNextStep();
      }
    } else {
      this.markFormGroupTouched(this.participantForm);
      this.notificationService.showWarning('Por favor complete todos los campos requeridos');
    }
  }

  /**
   * Map form data to API DTO
   */
  private mapFormDataToDto(): any {
    const formValue = this.participantForm.value;
    const personalData = formValue.personalData;
    const bioHistory = formValue.bioPsychosocialHistory;

    // Get current user ID
    const currentUser = this.tokenStorageService.getUser();
    const registeredById = currentUser?.id || 1;

    // Map emergency contacts
    const emergencyContacts = [
      {
        name: personalData.emergencyContactName,
        phone:
          personalData.emergencyContactPhone?.e164Number ||
          personalData.emergencyContactPhone?.internationalNumber ||
          personalData.emergencyContactPhone,
        email: personalData.emergencyContactEmail,
        address: personalData.emergencyContactAddress,
        city: personalData.emergencyContactCity,
        relationshipId: personalData.emergencyContactRelationship
          ? Number(personalData.emergencyContactRelationship)
          : null,
      },
    ];

    // Map family members
    const familyMembers = formValue.familyComposition.map((member: any) => ({
      name: member.name,
      birthDate: member.birthDate,
      occupation: member.occupation,
      familyRelationshipId: member.relationshipId ? Number(member.relationshipId) : null,
      academicLevelId: member.academicLevelId ? Number(member.academicLevelId) : null,
    }));

    // Map biopsychosocial history
    const bioPsychosocialHistory = {
      academicLevelId: bioHistory.academicLevelId ? Number(bioHistory.academicLevelId) : null,
      completedGrade: bioHistory.completedGrade,
      institution: bioHistory.institution,
      profession: bioHistory.profession,
      incomeLevelId: bioHistory.incomeLevelId ? Number(bioHistory.incomeLevelId) : null,
      incomeSourceId: bioHistory.incomeSourceId ? Number(bioHistory.incomeSourceId) : null,
      occupationalHistory: bioHistory.occupationalHistory,
      housingTypeId: bioHistory.housingTypeId ? Number(bioHistory.housingTypeId) : null,
      housing: bioHistory.housing,
    };

    // Build the complete DTO
    const dto = {
      firstName: personalData.firstName,
      secondName: personalData.secondName || undefined,
      firstLastName: personalData.firstLastName,
      secondLastName: personalData.secondLastName || undefined,
      phoneNumber:
        personalData.phoneNumber?.e164Number ||
        personalData.phoneNumber?.internationalNumber ||
        personalData.phoneNumber,
      email: personalData.email,
      documentTypeId: personalData.documentTypeId ? Number(personalData.documentTypeId) : null,
      documentNumber: personalData.documentNumber,
      address: personalData.address,
      city: personalData.city,
      state: personalData.state,
      zipCode: personalData.zipCode,
      birthDate: personalData.birthDate,
      religiousAffiliation: personalData.religiousAffiliation || undefined,
      genderId: personalData.genderId ? Number(personalData.genderId) : null,
      maritalStatusId: personalData.maritalStatusId ? Number(personalData.maritalStatusId) : null,
      healthInsuranceId: personalData.healthInsuranceId ? Number(personalData.healthInsuranceId) : null,
      customHealthInsurance: personalData.customHealthInsurance || undefined,
      referralSource: personalData.referralSource || undefined,
      registeredById,
      emergencyContacts,
      familyMembers,
      bioPsychosocialHistory,
    };

    return dto;
  }

  /**
   * Crea el participante al finalizar el paso 3
   */
  private createParticipantAndContinue(): void {
    this.isSubmitting = true;
    const dto = this.mapFormDataToDto();

    this.participantService
      .createParticipant(dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.notificationService.showSuccess('Participante creado exitosamente');

          // Guardar el ID del participante creado
          if (response && response.data && response.data.id) {
            this.participantId = Number(response.data.id);
          }

          // Navegar a la lista de participantes
          this.router.navigate(['/participants']);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error creating participant:', error);
          const errorMessage = error.error?.message || 'Error al crear el participante';
          this.notificationService.showError(errorMessage);
        },
      });
  }

  /**
   * Show confirmation dialog before submitting
   */
  private confirmSubmission(): void {
    this.notificationService.showConfirmation('participants.confirmCreate').then((result) => {
      if (result.isConfirmed) {
        this.submitForm();
      }
    });
  }

  /**
   * Submit form data to the service
   */
  private submitForm(): void {
    if (this.participantId) {
      this.updateParticipant();
    } else {
      this.createParticipantAndContinue();
    }
  }

  /**
   * Update existing participant
   */
  private updateParticipant(): void {
    if (!this.participantId) return;

    this.isSubmitting = true;
    const dto = this.mapFormDataToDto();

    this.participantService
      .updateParticipantComplete(this.participantId, dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.notificationService.showSuccess('Participante actualizado exitosamente');
          this.router.navigate(['/participants/detail', this.participantId]);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error updating participant:', error);
          const errorMessage = error.error?.message || 'Error al actualizar el participante';
          this.notificationService.showError(errorMessage);
        },
      });
  }

  /**
   * Reset form to initial state
   */

  resetForm(): void {
    this.notificationService.showConfirmation('participants.confirmReset').then((result) => {
      if (result.isConfirmed) {
        this.participantForm.reset();
        this.activeWizardStep = 1;
        this.initializeForm();
      }
    });
  }

  /**
   * Enviar caso al backend usando el participantId y los datos del formulario
   */
  private submitCase(): void {
    if (!this.participantId) {
      this.notificationService.showError('No se ha creado el participante.');
      return;
    }
    // Construir el payload para el caso
    const casePayload: any = {
      participantId: this.participantId,
      consultationReason: this.participantForm.get('consultationReason.reason')?.value,
      identifiedSituations: this.participantForm.get('identifiedSituations.situations')?.value,
      intervention: this.participantForm.get('intervention.intervention')?.value,
      followUpPlan: this.participantForm.get('followUpPlan.plan')?.value,
      physicalHealthHistory: this.participantForm.get('physicalHealthHistory')?.value,
      mentalHealthHistory: this.participantForm.get('mentalHealthHistory')?.value,
      ponderacion: this.participantForm.get('assessment')?.value,
      interventionPlans: this.participantForm.get('interventionPlan')?.value,
      progressNotes: this.participantForm.get('progressNotes')?.value,
      referrals: this.participantForm.get('referrals.description')?.value,
      closingNote: this.participantForm.get('closingNote')?.value,
    };
    this.isSubmitting = true;
    this.caseService
      .createCase(casePayload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.notificationService.showSuccess('Caso creado correctamente');
          // Puedes navegar o mostrar info aquí
        },
        error: (error) => {
          this.isSubmitting = false;
          this.notificationService.showError('Error al crear el caso');
        },
      });
  }

  /**
   * Cancel and navigate back
   */
  cancel(): void {
    if (this.participantForm.dirty) {
      this.notificationService.showConfirmation('participants.confirmCancel').then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/participants']);
        }
      });
    } else {
      this.router.navigate(['/participants']);
    }
  }

  /**
   * Get progress percentage for current step
   */
  getProgressPercentage(): number {
    const totalSteps = 3; // Total number of wizard steps
    return (this.activeWizardStep / totalSteps) * 100;
  }

  /**
   * Check if health insurance "other" option is selected
   */
  isHealthInsuranceOther(): boolean {
    return this.participantForm.get('personalData.healthInsuranceId')?.value === 'other';
  }

  /**
   * Check if schedule next appointment is selected
   */
  isScheduleNextAppointment(): boolean {
    return this.participantForm.get('followUpPlan.scheduleNextAppointment')?.value === true;
  }

  /**
   * Get approach type options for progress notes
   */
  getApproachTypeOptions(): Array<{ value: string; label: string }> {
    return [
      { value: 'CP', label: 'participants.approachType.inPerson' },
      { value: 'E', label: 'participants.approachType.email' },
      { value: 'EC', label: 'participants.approachType.casualEncounter' },
      { value: 'Ll', label: 'participants.approachType.call' },
      { value: 'TC', label: 'participants.approachType.teleconsultation' },
      { value: 'V', label: 'participants.approachType.virtual' },
    ];
  }

  /**
   * Get process options for progress notes
   */
  getProcessOptions(): Array<{ value: string; label: string }> {
    return [
      { value: 'S', label: 'participants.process.followUp' },
      { value: 'C', label: 'participants.process.closure' },
      { value: 'T', label: 'participants.process.transfer' },
      { value: 'D', label: 'participants.process.referral' },
    ];
  }

  /**
   * Get relationship options (updated list)
   */
  getRelationshipOptions(): Array<{ value: string; label: string }> {
    return [
      { value: 'father', label: 'participants.relationship.father' },
      { value: 'mother', label: 'participants.relationship.mother' },
      { value: 'fatherInLaw', label: 'participants.relationship.fatherInLaw' },
      { value: 'motherInLaw', label: 'participants.relationship.motherInLaw' },
      { value: 'son', label: 'participants.relationship.son' },
      { value: 'daughter', label: 'participants.relationship.daughter' },
      { value: 'brother', label: 'participants.relationship.brother' },
      { value: 'sister', label: 'participants.relationship.sister' },
      { value: 'sonInLaw', label: 'participants.relationship.sonInLaw' },
      { value: 'daughterInLaw', label: 'participants.relationship.daughterInLaw' },
      { value: 'grandfather', label: 'participants.relationship.grandfather' },
      { value: 'grandmother', label: 'participants.relationship.grandmother' },
      { value: 'grandson', label: 'participants.relationship.grandson' },
      { value: 'granddaughter', label: 'participants.relationship.granddaughter' },
      { value: 'brotherInLaw', label: 'participants.relationship.brotherInLaw' },
      { value: 'sisterInLaw', label: 'participants.relationship.sisterInLaw' },
      { value: 'uncle', label: 'participants.relationship.uncle' },
      { value: 'aunt', label: 'participants.relationship.aunt' },
      { value: 'nephew', label: 'participants.relationship.nephew' },
      { value: 'niece', label: 'participants.relationship.niece' },
      { value: 'greatGrandfather', label: 'participants.relationship.greatGrandfather' },
      { value: 'greatGrandmother', label: 'participants.relationship.greatGrandmother' },
      { value: 'stepbrother', label: 'participants.relationship.stepbrother' },
      { value: 'stepsister', label: 'participants.relationship.stepsister' },
      { value: 'stepfather', label: 'participants.relationship.stepfather' },
      { value: 'stepmother', label: 'participants.relationship.stepmother' },
      { value: 'friend', label: 'participants.relationship.friend' },
      { value: 'other', label: 'participants.relationship.other' },
    ];
  }

  /**
   * Get income level options
   */
  getIncomeLevelOptions(): Array<{ value: string; label: string }> {
    return [
      { value: 'lessThanOne', label: 'participants.incomeLevel.lessThanOne' },
      { value: 'oneSMLV', label: 'participants.incomeLevel.oneSMLV' },
      { value: 'moreThanOne', label: 'participants.incomeLevel.moreThanOne' },
    ];
  }

  /**
   * Create a new family member form
   */
  createFamilyMemberForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      birthDate: [''],
      occupation: [''],
      relationshipId: [''],
      academicLevelId: [''],
    });
  }

  /**
   * Get family composition FormArray
   */
  get familyCompositionArray(): FormArray {
    return this.participantForm.get('familyComposition') as FormArray;
  }

  /**
   * Add new family member
   */
  addFamilyMember(): void {
    this.familyCompositionArray.push(this.createFamilyMemberForm());
  }

  /**
   * Remove family member at specific index
   */
  removeFamilyMember(index: number): void {
    if (this.familyCompositionArray.length > 1) {
      this.familyCompositionArray.removeAt(index);
    }
  }

  /**
   * Create a new intervention plan item
   */
  createInterventionPlanItem(): FormGroup {
    return this.formBuilder.group({
      goal: ['', Validators.required], // Meta
      objectives: ['', Validators.required], // Objetivos
      activities: ['', Validators.required], // Actividades o técnicas
      timeframe: ['', Validators.required], // Tiempo
      responsiblePerson: ['', Validators.required], // Persona responsable
      evaluationCriteria: ['', Validators.required], // Criterio de evaluación
    });
  }

  /**
   * Get intervention plan FormArray
   */
  get interventionPlanArray(): FormArray {
    return this.participantForm.get('interventionPlan') as FormArray;
  }

  /**
   * Add new intervention plan item
   */
  addInterventionPlanItem(): void {
    this.interventionPlanArray.push(this.createInterventionPlanItem());
  }

  /**
   * Remove intervention plan item at specific index
   */
  removeInterventionPlanItem(index: number): void {
    if (this.interventionPlanArray.length > 1) {
      this.interventionPlanArray.removeAt(index);
    }
  }

  /**
   * Obtener label dinámico para el campo state según el país
   */
  get stateLabel(): string {
    const country = this.countryService.getCurrentCountry();
    return country === 'CO' ? 'Departamento' : 'Estado';
  }

  /**
   * Obtener label dinámico para el campo de seguro médico según el país
   */
  get healthInsuranceLabel(): string {
    return this.countryService.healthInsuranceLabel;
  }
}
