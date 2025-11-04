import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbNavModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';

import { CaseService } from '../../../core/services/case.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import {
  CreateCaseDto,
  ApproachType,
  ProcessType,
  Medication,
  SubstanceUse,
  ProgressNote,
  Referral,
} from '../../../core/interfaces/case.interface';

/**
 * Component for creating and editing cases
 * Multi-step wizard with 11 sections
 */
@Component({
  selector: 'app-create-case',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbNavModule, NgbProgressbarModule, TranslocoModule, PageTitleComponent],
  templateUrl: './create-case.component.html',
  styleUrls: ['./create-case.component.scss'],
})
export class CreateCaseComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly caseService = inject(CaseService);
  private readonly notificationService = inject(NotificationService);
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();

  // Form
  caseForm!: FormGroup;
  activeWizardStep = 1;
  participantId!: number;
  caseId?: number;
  isEditMode = false;

  // Breadcrumb
  breadcrumbItems: BreadcrumbItem[] = [];

  // Enums for templates
  approachTypes = Object.values(ApproachType);
  processTypes = Object.values(ProcessType);

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.participantId = +params['participantId'];
      this.caseId = params['id'] ? +params['id'] : undefined;
      this.isEditMode = !!this.caseId;

      this.setupBreadcrumb();
      this.initializeForm();

      if (this.isEditMode && this.caseId) {
        this.loadCase();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'participants.title' },
      { label: this.isEditMode ? 'cases.edit' : 'cases.create', active: true },
    ];
  }

  private initializeForm(): void {
    this.caseForm = this.formBuilder.group({
      // Step 1: Consultation Reason
      consultationReason: this.formBuilder.group({
        reason: ['', Validators.required],
        referredBy: [''],
        observations: [''],
      }),

      // Step 2: Identified Situations
      identifiedSituations: this.formBuilder.group({
        situations: [[], Validators.required],
        description: ['', Validators.required],
        urgencyLevel: ['', Validators.required],
      }),

      // Step 3: Intervention
      intervention: this.formBuilder.group({
        type: ['', Validators.required],
        description: ['', Validators.required],
        startDate: ['', Validators.required],
        objectives: this.formBuilder.array([]),
        methodology: [''],
      }),

      // Step 4: Follow-up Plan
      followUpPlan: this.formBuilder.group({
        scheduleNextAppointment: [false],
        nextAppointmentDate: [''],
        nextAppointmentTime: [''],
        frequency: [''],
        duration: [''],
        goals: this.formBuilder.array([]),
        observations: [''],
      }),

      // Step 5: Physical Health History
      physicalHealthHistory: this.formBuilder.group({
        hasChronicDiseases: [false],
        chronicDiseases: this.formBuilder.array([]),
        takingMedications: [false],
        medications: this.formBuilder.array([]),
        hasAllergies: [false],
        allergies: this.formBuilder.array([]),
        hasDisabilities: [false],
        disabilities: this.formBuilder.array([]),
        recentSurgeries: [''],
        currentTreatments: [''],
        observations: [''],
      }),

      // Step 6: Mental Health History
      mentalHealthHistory: this.formBuilder.group({
        hasPreviousTreatment: [false],
        previousTreatmentDetails: [''],
        hasPsychiatricDiagnosis: [false],
        psychiatricDiagnoses: this.formBuilder.array([]),
        takingPsychiatricMedication: [false],
        psychiatricMedications: this.formBuilder.array([]),
        hasSubstanceUse: [false],
        substances: this.formBuilder.array([]),
        hasSuicidalThoughts: [false],
        suicidalThoughtsDetails: [''],
        hasViolenceHistory: [false],
        violenceDetails: [''],
        familyMentalHealthHistory: [''],
        observations: [''],
      }),

      // Step 7: Assessment (Ponderación)
      assessment: this.formBuilder.group({
        cognitiveFunction: this.formBuilder.group({
          rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
          observations: ['', Validators.required],
        }),
        emotionalState: this.formBuilder.group({
          rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
          observations: ['', Validators.required],
        }),
        socialFunctioning: this.formBuilder.group({
          rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
          observations: ['', Validators.required],
        }),
        familyDynamics: this.formBuilder.group({
          rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
          observations: ['', Validators.required],
        }),
        copingSkills: this.formBuilder.group({
          rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
          observations: ['', Validators.required],
        }),
        riskFactors: this.formBuilder.group({
          suicideRisk: ['none', Validators.required],
          violenceRisk: ['none', Validators.required],
          selfHarmRisk: ['none', Validators.required],
          otherRisks: this.formBuilder.array([]),
        }),
        protectiveFactors: this.formBuilder.array([]),
        clinicalImpression: ['', Validators.required],
        diagnosticHypothesis: this.formBuilder.array([]),
      }),

      // Step 8: Intervention Plan
      interventionPlan: this.formBuilder.group({
        objectives: this.formBuilder.array([]),
        strategies: this.formBuilder.array([]),
        techniques: this.formBuilder.array([]),
        expectedDuration: ['', Validators.required],
        evaluationCriteria: this.formBuilder.array([]),
        contingencyPlan: [''],
      }),

      // Step 9: Progress Notes
      progressNotes: this.formBuilder.array([]),

      // Step 10: Referrals
      referrals: this.formBuilder.array([]),

      // Step 11: Closing Note (optional, for closing cases)
      closingNote: this.formBuilder.group({
        closureDate: [''],
        closureReason: [''],
        achievements: [''],
        recommendations: [''],
        observations: [''],
        followUpSuggestions: [''],
      }),
    });

    this.setupConditionalValidators();
  }

  private setupConditionalValidators(): void {
    // Add conditional validators based on form state
    // For example, if scheduleNextAppointment is true, make date/time required
    const followUpPlan = this.caseForm.get('followUpPlan');
    followUpPlan
      ?.get('scheduleNextAppointment')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((scheduled) => {
        const dateControl = followUpPlan.get('nextAppointmentDate');
        const timeControl = followUpPlan.get('nextAppointmentTime');

        if (scheduled) {
          dateControl?.setValidators(Validators.required);
          timeControl?.setValidators(Validators.required);
        } else {
          dateControl?.clearValidators();
          timeControl?.clearValidators();
        }

        dateControl?.updateValueAndValidity();
        timeControl?.updateValueAndValidity();
      });
  }

  private loadCase(): void {
    if (!this.caseId) return;

    this.caseService
      .getCaseById(this.caseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.caseForm.patchValue(response.data);
        },
        error: (error) => {
          console.error('Error loading case:', error);
          this.router.navigate(['/participants']);
        },
      });
  }

  // Navigation methods
  goToNextStep(): void {
    if (this.isStepValid(this.activeWizardStep)) {
      this.activeWizardStep = Math.min(this.activeWizardStep + 1, 11);
    } else {
      this.notificationService.showWarning('Por favor complete todos los campos requeridos');
    }
  }

  goToPreviousStep(): void {
    this.activeWizardStep = Math.max(this.activeWizardStep - 1, 1);
  }

  private isStepValid(step: number): boolean {
    const stepControls: { [key: number]: string } = {
      1: 'consultationReason',
      2: 'identifiedSituations',
      3: 'intervention',
      4: 'followUpPlan',
      5: 'physicalHealthHistory',
      6: 'mentalHealthHistory',
      7: 'assessment',
      8: 'interventionPlan',
      9: 'progressNotes',
      10: 'referrals',
      11: 'closingNote',
    };

    const controlName = stepControls[step];
    if (!controlName) return true;

    const control = this.caseForm.get(controlName);
    return control?.valid || false;
  }

  // Submit methods
  onSubmit(): void {
    if (this.activeWizardStep === 11) {
      this.confirmSubmission();
    } else {
      this.goToNextStep();
    }
  }

  private confirmSubmission(): void {
    const title = this.isEditMode ? '¿Está seguro de actualizar este caso?' : '¿Está seguro de crear este caso?';
    const text = this.isEditMode
      ? 'Los cambios se guardarán permanentemente'
      : 'El caso se creará con la información proporcionada';

    this.notificationService.showConfirmation(title, { text }).then((result) => {
      if (result.isConfirmed) {
        this.submitForm();
      }
    });
  }

  private submitForm(): void {
    if (this.caseForm.invalid) {
      this.notificationService.showError('Por favor complete todos los campos requeridos');
      return;
    }

    const caseDto: CreateCaseDto = this.mapFormDataToDto();

    if (this.isEditMode && this.caseId) {
      this.updateCase(caseDto);
    } else {
      this.createCase(caseDto);
    }
  }

  private createCase(caseDto: CreateCaseDto): void {
    this.caseService
      .createCase(caseDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/participants/detail', this.participantId]);
        },
        error: (error) => {
          console.error('Error creating case:', error);
        },
      });
  }

  private updateCase(caseDto: CreateCaseDto): void {
    if (!this.caseId) return;

    this.caseService
      .updateCase(this.caseId, caseDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/participants/detail', this.participantId]);
        },
        error: (error) => {
          console.error('Error updating case:', error);
        },
      });
  }

  private mapFormDataToDto(): CreateCaseDto {
    const formValue = this.caseForm.value;

    return {
      participantId: this.participantId,
      consultationReason: formValue.consultationReason,
      identifiedSituations: formValue.identifiedSituations,
      intervention: formValue.intervention,
      followUpPlan: formValue.followUpPlan,
      physicalHealthHistory: formValue.physicalHealthHistory,
      mentalHealthHistory: formValue.mentalHealthHistory,
      assessment: formValue.assessment,
      interventionPlan: formValue.interventionPlan,
      progressNotes: formValue.progressNotes || [],
      referrals: formValue.referrals || [],
    };
  }

  // FormArray helper methods
  get interventionObjectives(): FormArray {
    return this.caseForm.get('intervention.objectives') as FormArray;
  }

  addInterventionObjective(): void {
    this.interventionObjectives.push(this.formBuilder.control('', Validators.required));
  }

  removeInterventionObjective(index: number): void {
    this.interventionObjectives.removeAt(index);
  }

  // Add similar methods for other FormArrays...
  // (medications, allergies, disabilities, etc.)

  // Field error handling
  hasFieldError(fieldPath: string): boolean {
    const field = this.caseForm.get(fieldPath);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldPath: string): string {
    const field = this.caseForm.get(fieldPath);
    if (field?.hasError('required')) return 'Este campo es requerido';
    if (field?.hasError('min')) return 'Valor mínimo no alcanzado';
    if (field?.hasError('max')) return 'Valor máximo excedido';
    return '';
  }

  // Progress calculation
  getProgressPercentage(): number {
    return (this.activeWizardStep / 11) * 100;
  }
}
