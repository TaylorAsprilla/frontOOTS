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
import { Router } from '@angular/router';
import { NgbNavModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';
import { ParticipantService } from '../../../core/services/participant.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { ParticipantFormData, ValidationMessages } from '../../../core/interfaces/participant.interface';
import { CaseService } from '../../../core/services/case.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';

@Component({
  selector: 'app-create-participant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbNavModule, NgbProgressbarModule, TranslocoModule, PageTitleComponent],
  templateUrl: './create-participant.component.html',
  styleUrls: ['./create-participant.component.scss'],
})
export class CreateParticipantComponent implements OnInit, OnDestroy {
  private readonly caseService = inject(CaseService);
  private readonly tokenStorageService = inject(TokenStorageService);
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
    this.initializeForm();
    this.setupFormSubscriptions();
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize the reactive form with all sections
   */
  private initializeForm(): void {
    this.participantForm = this.formBuilder.group({
      personalData: this.formBuilder.group({
        firstName: ['', [Validators.required, Validators.maxLength(50)]],
        secondName: ['', Validators.maxLength(50)],
        firstLastName: ['', [Validators.required, Validators.maxLength(50)]],
        secondLastName: ['', Validators.maxLength(50)],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^(\+57)?[0-9]{10}$/)]],
        email: ['', [Validators.required, Validators.email]],
        documentTypeId: ['', Validators.required],
        documentNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{6,12}$/)]],
        address: ['', [Validators.required, Validators.maxLength(200)]],
        city: ['', [Validators.required, Validators.maxLength(50)]],
        birthDate: ['', [Validators.required, this.validateMinimumAge(18)]],
        religiousAffiliation: [''],
        referralSource: [''],
        genderId: ['', Validators.required],
        maritalStatusId: ['', Validators.required],
        healthInsuranceId: ['', Validators.required],
        customHealthInsurance: [''],
        // Emergency Contact fields
        emergencyContactName: ['', Validators.required],
        emergencyContactPhone: ['', [Validators.required]],
        emergencyContactEmail: ['', [Validators.required, Validators.email]],
        emergencyContactAddress: ['', Validators.required],
        emergencyContactCity: ['', Validators.required],
        emergencyContactRelationship: ['', Validators.required],
      }),

      familyComposition: this.formBuilder.array([this.createFamilyMemberForm()]),

      consultationReason: this.formBuilder.group({
        reason: [''],
        participantReason: [''], // "según el participante"
      }),

      identifiedSituations: this.formBuilder.group({
        situations: [''],
      }),

      intervention: this.formBuilder.group({
        intervention: [''],
        actionTaken: [''], // "Registre la acción tomada"
      }),

      followUpPlan: this.formBuilder.group({
        plan: [''],
        scheduleNextAppointment: [false],
        nextAppointmentDate: [''],
        nextAppointmentTime: [''],
      }),

      bioPsychosocialHistory: this.formBuilder.group({
        schooling: [''],
        completedGrade: [''],
        institution: [''],
        profession: [''],
        incomeSource: [''],
        incomeLevel: [''], // "Menos de 1 SMLV", "1 SMLV", "Más de 1 SMLV"
        occupationalHistory: [''],
        housing: [''],
        housingTypeId: ['', Validators.required], // Moved from personalData
      }),

      physicalHealthHistory: this.formBuilder.group({
        physicalConditions: [''], // "¿Tiene usted un diagnóstico de salud física? ¿Cuál?"
        receivingTreatment: [''],
        treatmentDetails: [''],
        paternalFamilyHistory: [''], // "Antecedentes familiares de salud física"
        maternalFamilyHistory: [''], // "Antecedentes familiares de salud física"
        physicalHealthObservations: [''],
      }),

      mentalHealthHistory: this.formBuilder.group({
        mentalConditions: [''], // "¿Tiene usted un diagnóstico de salud mental? ¿Cuál?"
        receivingMentalTreatment: [''],
        mentalTreatmentDetails: [''],
        paternalMentalHistory: [''], // "Antecedentes familiares de salud mental"
        maternalMentalHistory: [''], // "Antecedentes familiares de salud mental"
        mentalHealthObservations: [''],
      }),

      assessment: this.formBuilder.group({
        consultationReason: [''],
        weighting: [''], // "Describa la situación identificada"
        concurrentFactors: [''], // "Describa las condiciones favorables que identifica"
        criticalFactors: [''], // "Describa condiciones que no favorecen el proceso de ayuda"
        problemAnalysis: [''], // "Indique el enfoque teórico desde el cual abordará el proceso de ayuda"
      }),

      interventionPlan: this.formBuilder.array([this.createInterventionPlanItem()]),

      progressNotes: this.formBuilder.array([this.createEmptyProgressNote()]),

      referrals: this.formBuilder.group({
        description: [''],
      }),

      closingNote: this.formBuilder.group({
        observations: [''],
        closureReason: [''], // Motivo de cierre
        achievements: [''], // Logros alcanzados
        recommendations: [''], // Recomendaciones
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

    // Check for duplicate document number
    const documentControl = this.participantForm.get('personalData.documentNumber');
    if (documentControl) {
      documentControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        if (value && value.length >= 6) {
          this.checkDocumentExists(value);
        }
      });
    }
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
   * Check if document number already exists
   */
  private checkDocumentExists(documentNumber: string): void {
    this.participantService
      .checkParticipantExists(documentNumber)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result.exists) {
            const documentControl = this.participantForm.get('personalData.documentNumber');
            if (documentControl) {
              documentControl.setErrors({ documentExists: true });
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
    if (this.participantForm.valid && !this.isSubmitting) {
      // Si estamos en el paso 3 (bioPsychosocialHistory), crear el participante
      if (this.activeWizardStep === 3) {
        this.createParticipantAndContinue();
      } else {
        this.confirmSubmission();
      }
    } else {
      this.markFormGroupTouched(this.participantForm);
      this.notificationService.showWarning('participants.validation.completeRequired');
    }
  }

  /**
   * Crea el participante al finalizar el paso 3 y continúa el wizard
   */
  private createParticipantAndContinue(): void {
    this.isSubmitting = true;
    const formData = this.participantForm.value as ParticipantFormData;
    this.participantService
      .createParticipant(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.notificationService.showSuccess('participants.createSuccess');
          // Guardar el ID del participante creado para usarlo en los siguientes pasos
          if (response && response.data && response.data.id) {
            this.participantId = Number(response.data.id);
            // Llamar a submitCase automáticamente tras crear participante
            const token = this.tokenStorageService.getToken();
            if (token) {
              this.submitCase(token);
            } else {
              this.notificationService.showError('No se encontró el token de autenticación.');
            }
          }
          // Avanzar al siguiente paso del wizard
          this.goToNextStep();
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error creating participant:', error);
          this.notificationService.showError('participants.createError');
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
    this.isSubmitting = true;
    const formData = this.participantForm.value as ParticipantFormData;

    this.participantService
      .createParticipant(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.notificationService.showSuccess('participants.createSuccess');
          this.router.navigate(['/participants']);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error creating participant:', error);
          this.notificationService.showError('participants.createError');
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
  private submitCase(token: string): void {
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
      .createCase(casePayload, token)
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
    const totalSteps = 14; // Total number of wizard steps
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
}
