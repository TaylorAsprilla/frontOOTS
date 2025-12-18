import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbNavModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';

import { CaseService } from '../../../core/services/case.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { IdentifiedSituationService, IdentifiedSituation } from '../../../core/services/identified-situation.service';
import { FamilyRelationship } from '../../configuration/family-relationship/family-relationship.interface';
import { AcademicLevel } from '../../../core/interfaces/academic-level.interface';
import { IncomeSource } from '../../configuration/income-source/income-source.interface';
import { IncomeLevel } from '../../configuration/income-level/income-level.interface';
import { HousingType } from '../../configuration/housing-type/housing-type.interface';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import {
  CreateCaseDto,
  FollowUpPlanDto,
  PhysicalHealthHistoryDto,
  MentalHealthHistoryDto,
  WeighingDto,
  InterventionPlanDto,
  ProgressNoteDto,
  ClosingNoteDto,
  ApproachType,
  ProcessType,
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
  private readonly identifiedSituationService = inject(IdentifiedSituationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();

  // Form
  caseForm!: FormGroup;
  activeWizardStep = 1;
  participantId!: number;
  caseId?: number;
  isEditMode = false;

  // Data
  identifiedSituations: IdentifiedSituation[] = [];
  familyRelationships: FamilyRelationship[] = [];
  academicLevels: AcademicLevel[] = [];
  incomeSources: IncomeSource[] = [];
  incomeLevels: IncomeLevel[] = [];
  housingTypes: HousingType[] = [];

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
      this.loadFamilyRelationshipsFromResolver();
      this.loadAcademicLevelsFromResolver();
      this.loadIncomeSourcesFromResolver();
      this.loadIncomeLevelsFromResolver();
      this.loadHousingTypesFromResolver();
      this.initializeForm();
      this.loadIdentifiedSituations();

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

  private initializeForm(): void {
    this.caseForm = this.formBuilder.group({
      // Step 1: Family Members (Composición Familiar)
      familyMembers: this.formBuilder.array([this.createFamilyMemberForm()]),

      // Step 2: Biopsychosocial History (Historial BioPsicosocial)
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

      // Step 3: Consultation Reason
      consultationReason: this.formBuilder.group({
        reason: ['', Validators.required],
        referredBy: [''],
        observations: [''],
      }),

      // Step 4: Identified Situations
      identifiedSituations: this.formBuilder.group({
        situations: [[], [Validators.required, this.atLeastOneSelectedValidator()]],
      }),

      // Step 5: Intervention
      intervention: this.formBuilder.group({
        action: ['', Validators.required],
      }),

      // Step 6: Follow-up Plan
      followUpPlan: this.formBuilder.group({
        processCompleted: [false],
        servicesCoordinated: [false],
        servicesAgency: [''],
        referralMade: [false],
        referralDetails: [''],
        appointmentScheduled: [false],
        appointmentDate: [''],
        appointmentTime: [''],
        otherDetails: [''],
      }),

      // Step 7: Physical Health History
      physicalHealthHistory: this.formBuilder.group({
        conditions: this.formBuilder.array([]),
      }),

      // Step 8: Mental Health History
      mentalHealthHistory: this.formBuilder.group({
        conditions: this.formBuilder.array([]),
      }),

      // Step 9: Assessment (Ponderación)
      assessment: this.formBuilder.group({
        generalDescription: ['', Validators.required],
        concurrentFactors: ['', Validators.required],
        criticalFactors: ['', Validators.required],
        theoreticalFramework: ['', Validators.required],
      }),

      // Step 10: Intervention Plan
      interventionPlan: this.formBuilder.group({
        interventions: this.formBuilder.array([]),
      }),

      // Step 11: Progress Notes
      progressNotes: this.formBuilder.group({
        notes: this.formBuilder.array([]),
      }),

      // Step 12: Referrals (Referidos)
      referrals: this.formBuilder.group({
        referralsJustification: ['', Validators.required],
      }),

      // Step 13: Closing Note (optional, for closing cases)
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

  private loadIdentifiedSituations(): void {
    this.identifiedSituationService
      .getActive()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (situations) => {
          this.identifiedSituations = situations;
        },
        error: (error) => {
          console.error('Error loading identified situations:', error);
          this.notificationService.showError('Error al cargar las situaciones identificadas');
        },
      });
  }

  /**
   * Custom validator to ensure at least one checkbox is selected
   */
  private atLeastOneSelectedValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!Array.isArray(value) || value.length === 0) {
        return { atLeastOne: true };
      }
      return null;
    };
  }

  onSituationChange(event: Event, situationId: number): void {
    const checkbox = event.target as HTMLInputElement;
    const situationsControl = this.caseForm.get('identifiedSituations.situations');
    const situations: number[] = situationsControl?.value || [];

    if (checkbox.checked) {
      if (!situations.includes(situationId)) {
        situations.push(situationId);
      }
    } else {
      const index = situations.indexOf(situationId);
      if (index > -1) {
        situations.splice(index, 1);
      }
    }

    situationsControl?.setValue(situations);
    situationsControl?.markAsTouched();
    situationsControl?.updateValueAndValidity();
  }

  isSituationSelected(situationId: number): boolean {
    const situations = this.caseForm.get('identifiedSituations.situations')?.value || [];
    return situations.includes(situationId);
  }

  // Family Members methods
  get familyMembersArray(): FormArray {
    return this.caseForm.get('familyMembers') as FormArray;
  }

  createFamilyMemberForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      birthDate: [''],
      occupation: [''],
      familyRelationshipId: [''],
      academicLevelId: [''],
    });
  }

  addFamilyMember(): void {
    this.familyMembersArray.push(this.createFamilyMemberForm());
  }

  removeFamilyMember(index: number): void {
    if (this.familyMembersArray.length > 1) {
      this.familyMembersArray.removeAt(index);
    }
  }

  // Physical Health Conditions methods
  get physicalConditions(): FormArray {
    return this.caseForm.get('physicalHealthHistory.conditions') as FormArray;
  }

  addPhysicalCondition(): void {
    const conditionGroup = this.formBuilder.group({
      condition: [''],
      receivingTreatment: [false],
      treatmentDetails: [''],
      paternalFamilyHistory: [''],
      maternalFamilyHistory: [''],
      observations: [''],
    });
    this.physicalConditions.push(conditionGroup);
  }

  removePhysicalCondition(index: number): void {
    this.physicalConditions.removeAt(index);
  }

  // Mental Health Conditions methods
  get mentalConditions(): FormArray {
    return this.caseForm.get('mentalHealthHistory.conditions') as FormArray;
  }

  addMentalCondition(): void {
    const conditionGroup = this.formBuilder.group({
      condition: [''],
      receivingTreatment: [false],
      treatmentDetails: [''],
      paternalFamilyHistory: [''],
      maternalFamilyHistory: [''],
      observations: [''],
    });
    this.mentalConditions.push(conditionGroup);
  }

  removeMentalCondition(index: number): void {
    this.mentalConditions.removeAt(index);
  }

  // Step 8: Intervention Plan methods
  get interventions(): FormArray {
    return this.caseForm.get('interventionPlan.interventions') as FormArray;
  }

  addIntervention(): void {
    const interventionGroup = this.formBuilder.group({
      goals: [''],
      objectives: [''],
      activities: [''],
      timeframe: [''],
      responsiblePerson: [''],
      evaluationCriteria: ['Observación subjetiva y objetiva del profesional.'],
      progressNotes: [''],
    });
    this.interventions.push(interventionGroup);
  }

  removeIntervention(index: number): void {
    this.interventions.removeAt(index);
  }

  // Step 9: Progress Notes methods
  get progressNotesArray(): FormArray {
    return this.caseForm.get('progressNotes.notes') as FormArray;
  }

  addProgressNote(): void {
    const noteGroup = this.formBuilder.group({
      date: [''],
      time: [''],
      approachType: [''],
      process: [''],
      interventionSummary: [''],
      observations: [''],
      agreements: [''],
    });
    this.progressNotesArray.push(noteGroup);
  }

  removeProgressNote(index: number): void {
    this.progressNotesArray.removeAt(index);
  }

  // Navigation methods
  goToNextStep(): void {
    if (this.isStepValid(this.activeWizardStep)) {
      this.activeWizardStep = Math.min(this.activeWizardStep + 1, 13);
    } else {
      this.notificationService.showWarning('Por favor complete todos los campos requeridos');
    }
  }

  goToPreviousStep(): void {
    this.activeWizardStep = Math.max(this.activeWizardStep - 1, 1);
  }

  private isStepValid(step: number): boolean {
    const stepControls: { [key: number]: string } = {
      1: 'familyMembers',
      2: 'bioPsychosocialHistory',
      3: 'consultationReason',
      4: 'identifiedSituations',
      5: 'intervention',
      6: 'followUpPlan',
      7: 'physicalHealthHistory',
      8: 'mentalHealthHistory',
      9: 'assessment',
      10: 'interventionPlan',
      11: 'progressNotes',
      12: 'referrals',
      13: 'closingNote',
    };

    const controlName = stepControls[step];
    if (!controlName) return true;

    const control = this.caseForm.get(controlName);
    return control?.valid || false;
  }

  // Submit methods
  onSubmit(): void {
    if (this.activeWizardStep === 13) {
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
      familyMembers: formValue.familyMembers.map((member: any) => ({
        name: member.name,
        birthDate: member.birthDate || null,
        occupation: member.occupation || null,
        familyRelationshipId: member.familyRelationshipId ? Number(member.familyRelationshipId) : null,
        academicLevelId: member.academicLevelId ? Number(member.academicLevelId) : null,
      })),
      bioPsychosocialHistory: {
        academicLevelId: formValue.bioPsychosocialHistory.academicLevelId
          ? Number(formValue.bioPsychosocialHistory.academicLevelId)
          : null,
        completedGrade: formValue.bioPsychosocialHistory.completedGrade,
        institution: formValue.bioPsychosocialHistory.institution,
        profession: formValue.bioPsychosocialHistory.profession,
        incomeSourceId: formValue.bioPsychosocialHistory.incomeSourceId
          ? Number(formValue.bioPsychosocialHistory.incomeSourceId)
          : null,
        incomeLevelId: formValue.bioPsychosocialHistory.incomeLevelId
          ? Number(formValue.bioPsychosocialHistory.incomeLevelId)
          : null,
        occupationalHistory: formValue.bioPsychosocialHistory.occupationalHistory,
        housingTypeId: formValue.bioPsychosocialHistory.housingTypeId
          ? Number(formValue.bioPsychosocialHistory.housingTypeId)
          : null,
        housing: formValue.bioPsychosocialHistory.housing,
      },
      consultationReason: formValue.consultationReason.reason,
      identifiedSituations: formValue.identifiedSituations.situations,
      intervention: formValue.intervention.action,
      followUpPlan: [
        {
          processCompleted: formValue.followUpPlan.processCompleted,
          coordinatedService: formValue.followUpPlan.servicesCoordinated ? formValue.followUpPlan.servicesAgency : null,
          referred: formValue.followUpPlan.referralMade,
          referralDetails: formValue.followUpPlan.referralDetails || null,
          orientationAppointment: formValue.followUpPlan.appointmentScheduled,
          appointmentDate: formValue.followUpPlan.appointmentDate || null,
          appointmentTime: formValue.followUpPlan.appointmentTime || null,
          otherDetails: formValue.followUpPlan.otherDetails || null,
        },
      ],
      physicalHealthHistory: formValue.physicalHealthHistory.conditions.map((condition: any) => ({
        currentConditions: condition.condition,
        medications: condition.receivingTreatment ? condition.treatmentDetails : null,
        familyHistoryFather: condition.paternalFamilyHistory,
        familyHistoryMother: condition.maternalFamilyHistory,
        observations: condition.observations,
      })),
      mentalHealthHistory: formValue.mentalHealthHistory.conditions.map((condition: any) => ({
        currentConditions: condition.condition,
        medications: condition.receivingTreatment ? condition.treatmentDetails : null,
        familyHistoryFather: condition.paternalFamilyHistory,
        familyHistoryMother: condition.maternalFamilyHistory,
        observations: condition.observations,
      })),
      weighing: {
        reasonConsultation: formValue.consultationReason.reason,
        identifiedSituation: formValue.identifiedSituations.situations.join(', '),
        favorableConditions: formValue.assessment.concurrentFactors,
        conditionsNotFavorable: formValue.assessment.criticalFactors,
        helpProcess: formValue.assessment.theoreticalFramework,
      },
      interventionPlans: formValue.interventionPlan.interventions.map((intervention: any) => ({
        goal: intervention.goals,
        objectives: intervention.objectives,
        activities: intervention.activities,
        timeline: intervention.timeframe,
        responsible: intervention.responsiblePerson,
        evaluationCriteria: intervention.evaluationCriteria,
      })),
      progressNotes: formValue.progressNotes.notes.map((note: any) => ({
        sessionDate: note.date,
        sessionType: note.approachType,
        summary: note.interventionSummary,
        observations: note.observations,
        agreements: note.agreements,
      })),
      referrals: formValue.referrals.referralsJustification,
      closingNote: formValue.closingNote.closureDate
        ? {
            closingDate: formValue.closingNote.closureDate,
            reason: formValue.closingNote.closureReason,
            achievements: formValue.closingNote.achievements,
            recommendations: formValue.closingNote.recommendations,
            observations: formValue.closingNote.observations,
          }
        : undefined,
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
    if (field?.hasError('atLeastOne')) return 'Debe seleccionar al menos una situación';
    if (field?.hasError('min')) return 'Valor mínimo no alcanzado';
    if (field?.hasError('max')) return 'Valor máximo excedido';
    return '';
  }

  // Progress calculation
  getProgressPercentage(): number {
    return (this.activeWizardStep / 11) * 100;
  }
}
