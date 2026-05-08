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
import { HasUnsavedChanges } from '../../../core/guards/unsaved-changes.guard';
import { IdentifiedSituationService, IdentifiedSituation } from '../../../core/services/identified-situation.service';
import { FamilyRelationship } from '../../configuration/family-relationship/family-relationship.interface';
import { AcademicLevel } from '../../../core/interfaces/academic-level.interface';
import { IncomeSource } from '../../configuration/income-source/income-source.interface';
import { IncomeLevel } from '../../configuration/income-level/income-level.interface';
import { HousingType } from '../../configuration/housing-type/housing-type.interface';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { CreateCaseDto, ApproachType, CaseStatus } from '../../../core/interfaces/case.interface';
import { ProcessType } from '../../configuration/process-types/process-type.interface';
import { ApproachType as ApproachTypeCatalog } from '../../configuration/approach-types/approach-type.interface';

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
export class CreateCaseComponent implements OnInit, OnDestroy, HasUnsavedChanges {
  private readonly formBuilder = inject(FormBuilder);
  private readonly caseService = inject(CaseService);
  private readonly notificationService = inject(NotificationService);
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly identifiedSituationService = inject(IdentifiedSituationService);
  readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();

  // Form
  caseForm!: FormGroup;
  activeWizardStep = 1;
  participantId!: number;
  caseId?: number;
  isEditMode = false;
  isViewMode = false;
  isLoadingCase = false;
  isCreatingCase = false;
  isCaseClosed = false;

  // Data
  identifiedSituations: IdentifiedSituation[] = [];
  familyRelationships: FamilyRelationship[] = [];
  academicLevels: AcademicLevel[] = [];
  incomeSources: IncomeSource[] = [];
  incomeLevels: IncomeLevel[] = [];
  housingTypes: HousingType[] = [];
  processTypes: ProcessType[] = [];
  approachTypes: ApproachTypeCatalog[] = [];

  // Breadcrumb
  breadcrumbItems: BreadcrumbItem[] = [];

  // Enums for templates
  approachTypesEnum = Object.values(ApproachType);

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.participantId = +params['participantId'];
      this.caseId = params['id'] ? +params['id'] : undefined;
      this.isViewMode = this.route.snapshot.data['mode'] === 'view';
      this.isEditMode = !!this.caseId && !this.isViewMode;

      this.setupBreadcrumb();
      this.loadFamilyRelationshipsFromResolver();
      this.loadAcademicLevelsFromResolver();
      this.loadIncomeSourcesFromResolver();
      this.loadIncomeLevelsFromResolver();
      this.loadHousingTypesFromResolver();
      this.loadProcessTypesFromResolver();
      this.loadApproachTypesFromResolver();
      this.initializeForm();
      this.loadIdentifiedSituations();
      this.addPhysicalCondition();
      this.addMentalCondition();
      this.addProgressNote();

      if ((this.isEditMode || this.isViewMode) && this.caseId) {
        this.loadCase();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * CanDeactivate guard: returns true if there are unsaved changes.
   * In view mode there are never "unsaved" changes.
   */
  hasUnsavedChanges(): boolean {
    if (this.isViewMode) return false;
    return this.caseForm?.dirty ?? false;
  }

  private setupBreadcrumb(): void {
    let label = 'cases.create';
    if (this.isViewMode) {
      label = 'cases.detail';
    } else if (this.isEditMode) {
      label = 'cases.edit';
    }
    this.breadcrumbItems = [{ label: 'participants.title' }, { label: label, active: true }];
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

  /**
   * Load process types from route resolver
   */
  private loadProcessTypesFromResolver(): void {
    const resolvedData = this.route.snapshot.data['processTypes'];
    if (resolvedData && Array.isArray(resolvedData)) {
      this.processTypes = resolvedData;
    } else {
      this.processTypes = [];
    }
  }

  private loadApproachTypesFromResolver(): void {
    const resolvedData = this.route.snapshot.data['approachTypes'];
    if (resolvedData && Array.isArray(resolvedData)) {
      this.approachTypes = resolvedData;
    } else {
      this.approachTypes = [];
    }
  }

  private initializeForm(): void {
    this.caseForm = this.formBuilder.group({
      // Step 1: Family Members (Composición Familiar)
      livesAlone: [false],
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
        selectedOption: ['', Validators.required],
        servicesAgency: [''],
        referralDetails: [''],
        appointmentDate: [''],
        appointmentTime: [''],
        otherDetails: [''],
      }),

      // Step 7: Physical Health History
      physicalHealthHistory: this.formBuilder.group({
        hasPhysicalHistory: [false],
        conditions: this.formBuilder.array([]),
      }),

      // Step 8: Mental Health History
      mentalHealthHistory: this.formBuilder.group({
        hasMentalHistory: [false],
        conditions: this.formBuilder.array([]),
      }),

      // Family Health History (independent – filled once for both physical and mental)
      familyHealthHistory: this.formBuilder.group({
        physicalFamilyHistoryFather: [''],
        physicalFamilyHistoryMother: [''],
        mentalFamilyHistoryFather: [''],
        mentalFamilyHistoryMother: [''],
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

    this.isLoadingCase = true;

    this.caseService
      .getCaseById(this.caseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const caseData = response.data;

          if (caseData) {
            // Mapear datos del caso al formulario
            this.mapCaseDataToForm(caseData);

            // Si es modo vista, deshabilitar formulario después de cargar datos
            if (this.isViewMode) {
              this.caseForm.disable();
            }

            this.notificationService.showSuccess('Caso cargado correctamente');
          } else {
            console.error('No se encontraron datos del caso');
            this.notificationService.showError('No se encontraron datos del caso');
          }

          this.isLoadingCase = false;
        },
        error: (error) => {
          console.error('Error al cargar el caso:', error);
          this.isLoadingCase = false;
          this.notificationService.showError('Error al cargar el caso: ' + (error.message || 'Error desconocido'));
          this.router.navigate(['/cases/list']);
        },
      });
  }

  /**
   * Map case data from API to form structure
   */
  private mapCaseDataToForm(caseData: any): void {
    try {
      // 1. Cargar miembros de familia
      const livesAloneFromData =
        typeof caseData.livesAlone === 'boolean'
          ? caseData.livesAlone
          : !caseData.familyMembers || !Array.isArray(caseData.familyMembers) || caseData.familyMembers.length === 0;
      this.caseForm.get('livesAlone')?.setValue(livesAloneFromData);
      this.toggleFamilyMembersValidators(livesAloneFromData);
      if (caseData.familyMembers && Array.isArray(caseData.familyMembers) && caseData.familyMembers.length > 0) {
        this.familyMembersArray.clear();
        caseData.familyMembers.forEach((member: any) => {
          const memberGroup = this.createFamilyMemberForm();
          // The API may return a nested object (familyRelationship.id) or a flat ID (familyRelationshipId)
          const familyRelationshipId = member.familyRelationshipId
            ? Number(member.familyRelationshipId)
            : member.familyRelationship?.id
              ? Number(member.familyRelationship.id)
              : '';
          const academicLevelId = member.academicLevelId
            ? Number(member.academicLevelId)
            : member.academicLevel?.id
              ? Number(member.academicLevel.id)
              : '';
          memberGroup.patchValue({
            name: member.name || '',
            birthDate: member.birthDate || '',
            occupation: member.occupation || '',
            familyRelationshipId,
            academicLevelId,
          });
          this.familyMembersArray.push(memberGroup);
        });
      }

      // 2. Cargar historial biopsicosocial
      if (caseData.bioPsychosocialHistory) {
        const bio = caseData.bioPsychosocialHistory;
        this.caseForm.get('bioPsychosocialHistory')?.patchValue({
          academicLevelId: bio.academicLevelId ? Number(bio.academicLevelId) : '',
          completedGrade: bio.completedGrade || '',
          institution: bio.institution || '',
          profession: bio.profession || '',
          incomeSourceId: bio.incomeSourceId ? Number(bio.incomeSourceId) : '',
          incomeLevelId: bio.incomeLevelId ? Number(bio.incomeLevelId) : '',
          occupationalHistory: bio.occupationalHistory || '',
          housingTypeId: bio.housingTypeId ? Number(bio.housingTypeId) : '',
          housing: bio.housing || '',
        });
      }

      // 3. Cargar motivo de consulta
      if (caseData.consultationReason) {
        // Si viene como string simple
        if (typeof caseData.consultationReason === 'string') {
          this.caseForm.get('consultationReason')?.patchValue({
            reason: caseData.consultationReason,
            referredBy: '',
            observations: '',
          });
        } else {
          // Si viene como objeto
          this.caseForm.get('consultationReason')?.patchValue(caseData.consultationReason);
        }
      }

      // 4. Cargar situaciones identificadas
      if (caseData.participantIdentifiedSituations && Array.isArray(caseData.participantIdentifiedSituations)) {
        // Extraer los IDs de las situaciones identificadas
        const situationIds = caseData.participantIdentifiedSituations.map((item: any) => item.identifiedSituationId);
        this.caseForm.get('identifiedSituations')?.patchValue({
          situations: situationIds,
        });
      } else if (caseData.identifiedSituations) {
        // Si viene como array de IDs
        if (Array.isArray(caseData.identifiedSituations)) {
          this.caseForm.get('identifiedSituations')?.patchValue({
            situations: caseData.identifiedSituations,
          });
        } else if (caseData.identifiedSituations.situations) {
          // Si viene como objeto con propiedad situations
          this.caseForm.get('identifiedSituations')?.patchValue(caseData.identifiedSituations);
        }
      }

      // 5. Cargar intervención
      if (caseData.intervention) {
        // Si viene como string simple
        if (typeof caseData.intervention === 'string') {
          this.caseForm.get('intervention')?.patchValue({
            action: caseData.intervention,
          });
        } else {
          // Si viene como objeto
          this.caseForm.get('intervention')?.patchValue({
            action: caseData.intervention.description || caseData.intervention.action || '',
          });
        }
      }

      // 6. Cargar plan de seguimiento
      if (caseData.followUpPlans && Array.isArray(caseData.followUpPlans) && caseData.followUpPlans.length > 0) {
        // Tomar el primer elemento del array
        const followUpData = caseData.followUpPlans[0];

        // Determinar qué opción está seleccionada
        let selectedOption = '';
        if (followUpData.processCompleted) {
          selectedOption = 'processCompleted';
        } else if (followUpData.coordinatedService) {
          selectedOption = 'servicesCoordinated';
        } else if (followUpData.referred) {
          selectedOption = 'referralMade';
        } else if (followUpData.orientationAppointment) {
          selectedOption = 'appointmentScheduled';
        }

        this.caseForm.get('followUpPlan')?.patchValue({
          selectedOption: selectedOption,
          servicesAgency: followUpData.coordinatedService || '',
          referralDetails: followUpData.referralDetails || '',
          appointmentDate: followUpData.appointmentDate || '',
          appointmentTime: followUpData.appointmentTime ? followUpData.appointmentTime.slice(0, 5) : '',
          otherDetails: followUpData.otherDetails || '',
        });
      } else if (caseData.followUpPlan) {
        // Si es un array, tomar el primer elemento
        const followUpData = Array.isArray(caseData.followUpPlan) ? caseData.followUpPlan[0] : caseData.followUpPlan;

        if (followUpData) {
          // Determinar qué opción está seleccionada
          let selectedOption = '';
          if (followUpData.processCompleted) {
            selectedOption = 'processCompleted';
          } else if (followUpData.coordinatedService) {
            selectedOption = 'servicesCoordinated';
          } else if (followUpData.referred) {
            selectedOption = 'referralMade';
          } else if (followUpData.orientationAppointment) {
            selectedOption = 'appointmentScheduled';
          }

          this.caseForm.get('followUpPlan')?.patchValue({
            selectedOption: selectedOption,
            servicesAgency: followUpData.coordinatedService || '',
            referralDetails: followUpData.referralDetails || '',
            appointmentDate: followUpData.appointmentDate || '',
            appointmentTime: followUpData.appointmentTime ? followUpData.appointmentTime.slice(0, 5) : '',
            otherDetails: followUpData.otherDetails || '',
          });
        }
      }

      // 7. Cargar condiciones físicas
      if (caseData.physicalHealthHistories && Array.isArray(caseData.physicalHealthHistories)) {
        this.physicalConditions.clear();
        if (caseData.physicalHealthHistories.length > 0) {
          this.caseForm.get('physicalHealthHistory.hasPhysicalHistory')?.setValue(true);
        }
        caseData.physicalHealthHistories.forEach((condition: any) => {
          const conditionGroup = this.formBuilder.group({
            condition: [condition.currentConditions || ''],
            receivingTreatment: [!!condition.medications],
            treatmentDetails: [condition.medications || ''],
            observations: [condition.observations || ''],
          });
          this.physicalConditions.push(conditionGroup);
        });
      } else if (caseData.physicalHealthHistory && Array.isArray(caseData.physicalHealthHistory)) {
        // Compatibilidad con versión anterior (singular)
        this.physicalConditions.clear();
        caseData.physicalHealthHistory.forEach((condition: any) => {
          const conditionGroup = this.formBuilder.group({
            condition: [condition.currentConditions || ''],
            receivingTreatment: [!!condition.medications],
            treatmentDetails: [condition.medications || ''],
            observations: [condition.observations || ''],
          });
          this.physicalConditions.push(conditionGroup);
        });
      }

      // 8. Cargar condiciones mentales
      if (caseData.mentalHealthHistories && Array.isArray(caseData.mentalHealthHistories)) {
        this.mentalConditions.clear();
        if (caseData.mentalHealthHistories.length > 0) {
          this.caseForm.get('mentalHealthHistory.hasMentalHistory')?.setValue(true);
        }
        caseData.mentalHealthHistories.forEach((condition: any) => {
          const conditionGroup = this.formBuilder.group({
            condition: [condition.currentConditions || ''],
            receivingTreatment: [!!condition.medications],
            treatmentDetails: [condition.medications || ''],
            observations: [condition.observations || ''],
          });
          this.mentalConditions.push(conditionGroup);
        });
      } else if (caseData.mentalHealthHistory && Array.isArray(caseData.mentalHealthHistory)) {
        // Compatibilidad con versión anterior (singular)
        this.mentalConditions.clear();
        caseData.mentalHealthHistory.forEach((condition: any) => {
          const conditionGroup = this.formBuilder.group({
            condition: [condition.currentConditions || ''],
            receivingTreatment: [!!condition.medications],
            treatmentDetails: [condition.medications || ''],
            observations: [condition.observations || ''],
          });
          this.mentalConditions.push(conditionGroup);
        });
      }

      // 8b. Cargar historial familiar de condiciones
      if (caseData.familyHealthHistories && Array.isArray(caseData.familyHealthHistories)) {
        const physicalFH = caseData.familyHealthHistories.find(
          (h: any) => h.historyType === 'physical' || h.history_type === 'physical',
        );
        const mentalFH = caseData.familyHealthHistories.find(
          (h: any) => h.historyType === 'mental' || h.history_type === 'mental',
        );
        this.caseForm.get('familyHealthHistory')?.patchValue({
          physicalFamilyHistoryFather: physicalFH?.familyHistoryFather || '',
          physicalFamilyHistoryMother: physicalFH?.familyHistoryMother || '',
          mentalFamilyHistoryFather: mentalFH?.familyHistoryFather || '',
          mentalFamilyHistoryMother: mentalFH?.familyHistoryMother || '',
        });
      }

      // 9. Cargar evaluación (weighing/assessment)
      if (caseData.weighing) {
        this.caseForm.get('assessment')?.patchValue({
          generalDescription: caseData.weighing.reasonConsultation || '',
          concurrentFactors: caseData.weighing.favorableConditions || '',
          criticalFactors: caseData.weighing.conditionsNotFavorable || '',
          theoreticalFramework: caseData.weighing.helpProcess || '',
        });
      } else if (caseData.assessment) {
        this.caseForm.get('assessment')?.patchValue(caseData.assessment);
      }

      // 10. Cargar plan de intervención
      if (caseData.interventionPlans && Array.isArray(caseData.interventionPlans)) {
        this.interventions.clear();
        caseData.interventionPlans.forEach((intervention: any) => {
          const interventionGroup = this.formBuilder.group({
            goals: [intervention.goal || ''],
            objectives: [intervention.objectives || ''],
            activities: [intervention.activities || ''],
            timeframe: [intervention.timeline || ''],
            responsiblePerson: [intervention.responsible || ''],
            evaluationCriteria: [intervention.evaluationCriteria || ''],
            progressNotes: [''],
          });
          this.interventions.push(interventionGroup);
        });
      } else if (caseData.interventionPlan?.interventions && Array.isArray(caseData.interventionPlan.interventions)) {
        this.interventions.clear();
        caseData.interventionPlan.interventions.forEach((intervention: any) => {
          const interventionGroup = this.formBuilder.group({
            goals: [intervention.goals || ''],
            objectives: [intervention.objectives || ''],
            activities: [intervention.activities || ''],
            timeframe: [intervention.timeframe || ''],
            responsiblePerson: [intervention.responsiblePerson || ''],
            evaluationCriteria: [
              intervention.evaluationCriteria || 'Observación subjetiva y objetiva del profesional.',
            ],
            progressNotes: [''],
          });
          this.interventions.push(interventionGroup);
        });
      }

      // 11. Cargar notas de progreso
      if (caseData.progressNotes && Array.isArray(caseData.progressNotes)) {
        this.progressNotesArray.clear();
        caseData.progressNotes.forEach((note: any) => {
          const noteGroup = this.formBuilder.group({
            date: [note.sessionDate || note.date || ''],
            time: [note.time || ''],
            approachType: [note.sessionType || note.approachType || ''],
            process: [note.process || ''],
            interventionSummary: [note.summary || note.interventionSummary || ''],
            agreements: [note.agreements || ''],
          });
          this.progressNotesArray.push(noteGroup);
        });
      }

      // 12. Cargar referidos
      if (caseData.referrals) {
        // Si viene como string simple
        if (typeof caseData.referrals === 'string') {
          this.caseForm.get('referrals')?.patchValue({
            referralsJustification: caseData.referrals,
          });
        } else {
          this.caseForm.get('referrals')?.patchValue(caseData.referrals);
        }
      }

      // 13. Cargar nota de cierre (si existe)
      if (caseData.closingNote) {
        const cn = caseData.closingNote;
        this.caseForm.get('closingNote')?.patchValue({
          closureDate: cn.closingDate || cn.closureDate || '',
          closureReason: cn.reason || cn.closureReason || '',
          achievements: cn.achievements || '',
          recommendations: cn.recommendations || '',
          observations: cn.observations || '',
          followUpSuggestions: cn.followUpSuggestions || '',
        });
      }

      // Forzar actualización de la vista
      this.caseForm.updateValueAndValidity();
      this.caseForm.markAsPristine();
      this.caseForm.markAsUntouched();
    } catch (error) {
      console.error('Error durante el mapeo de datos:', error);
      this.notificationService.showError('Error al cargar algunos datos del caso');
    }
  }

  /**
   * Get all validation errors from the form (for debugging)
   */
  private getFormValidationErrors(): any[] {
    const errors: any[] = [];
    Object.keys(this.caseForm.controls).forEach((key) => {
      const control = this.caseForm.get(key);
      if (control && control.errors) {
        errors.push({ field: key, errors: control.errors });
      }
    });
    return errors;
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
  /**
   * Validator: At least one option must be selected (DEPRECATED - now using required validator on selectedOption)
   */
  // private atLeastOneFollowUpOptionValidator(): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const group = control as FormGroup;
  //     const anySelected =
  //       group.get('processCompleted')?.value ||
  //       group.get('servicesCoordinated')?.value ||
  //       group.get('referralMade')?.value ||
  //       group.get('appointmentScheduled')?.value;
  //     return anySelected ? null : { atLeastOneOption: true };
  //   };
  // }

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
      occupation: ['', Validators.required],
      familyRelationshipId: ['', Validators.required],
      academicLevelId: ['', Validators.required],
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

  get livesAlone(): boolean {
    return !!this.caseForm.get('livesAlone')?.value;
  }

  onLivesAloneChange(checked: boolean): void {
    this.caseForm.get('livesAlone')?.setValue(checked);
    this.toggleFamilyMembersValidators(checked);
  }

  private toggleFamilyMembersValidators(livesAlone: boolean): void {
    const arr = this.familyMembersArray;
    arr.controls.forEach((group) => {
      const fg = group as FormGroup;
      ['name', 'occupation', 'familyRelationshipId', 'academicLevelId'].forEach((key) => {
        const ctrl = fg.get(key);
        if (!ctrl) return;
        if (livesAlone) {
          ctrl.clearValidators();
        } else {
          ctrl.setValidators(Validators.required);
        }
        ctrl.updateValueAndValidity({ emitEvent: false });
      });
    });
    if (livesAlone) {
      arr.disable({ emitEvent: false });
    } else {
      arr.enable({ emitEvent: false });
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
      observations: [''],
    });
    this.mentalConditions.push(conditionGroup);
  }

  removeMentalCondition(index: number): void {
    this.mentalConditions.removeAt(index);
  }

  get familyHealthHistoryGroup(): FormGroup {
    return this.caseForm.get('familyHealthHistory') as FormGroup;
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
      evaluationCriteria: [''],
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
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    const noteGroup = this.formBuilder.group({
      date: [currentDate],
      time: [currentTime],
      approachType: [''],
      process: [''],
      interventionSummary: [''],
      agreements: [''],
    });
    this.progressNotesArray.push(noteGroup);
  }

  removeProgressNote(index: number): void {
    this.progressNotesArray.removeAt(index);
  }

  // Navigation methods
  goToNextStep(): void {
    // Step 4 with no case yet → create
    if (this.activeWizardStep === 4 && !this.isEditMode && !this.caseId) {
      this.createInitialCase();
      return;
    }

    // Steps 5-12 with an existing caseId → auto-save current step then advance
    if (this.caseId && this.activeWizardStep >= 5 && this.activeWizardStep <= 12) {
      // Step 6: validate that at least one option is selected
      if (this.activeWizardStep === 6) {
        const followUpGroup = this.caseForm.get('followUpPlan');
        followUpGroup?.markAllAsTouched();
        if (followUpGroup?.invalid) return;
      }
      // Step 6: if processCompleted is selected, close the case instead of advancing
      if (
        this.activeWizardStep === 6 &&
        this.caseForm.get('followUpPlan.selectedOption')?.value === 'processCompleted'
      ) {
        this.closeCaseOnProcessCompleted();
        return;
      }
      // Step 6: save follow-up plan data
      if (this.activeWizardStep === 6) {
        const formValue = this.caseForm.getRawValue();
        const selectedOption = formValue.followUpPlan.selectedOption;
        const followUpData = {
          processCompleted: selectedOption === 'processCompleted',
          coordinatedService: selectedOption === 'servicesCoordinated' ? formValue.followUpPlan.servicesAgency : null,
          referred: selectedOption === 'referralMade',
          referralDetails: selectedOption === 'referralMade' ? formValue.followUpPlan.referralDetails || null : null,
          orientationAppointment: selectedOption === 'appointmentScheduled',
          appointmentDate:
            selectedOption === 'appointmentScheduled' ? formValue.followUpPlan.appointmentDate || null : null,
          appointmentTime:
            selectedOption === 'appointmentScheduled' ? formValue.followUpPlan.appointmentTime || null : null,
          otherDetails: formValue.followUpPlan.otherDetails || null,
        };
        this.caseService
          .updateCase(this.caseId, { followUpPlan: [followUpData] } as any)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              // If appointmentScheduled, also update status to IN_PROGRESS
              if (selectedOption === 'appointmentScheduled') {
                this.caseService
                  .updateCaseStatus(this.caseId!, CaseStatus.IN_PROGRESS)
                  .pipe(takeUntil(this.destroy$))
                  .subscribe({
                    next: () => {
                      this.activeWizardStep = Math.min(this.activeWizardStep + 1, 13);
                    },
                    error: (err) => console.error('Error al cambiar el estado del caso:', err),
                  });
              } else {
                this.activeWizardStep = Math.min(this.activeWizardStep + 1, 13);
              }
            },
            error: (err) => console.error('Error al guardar el plan a seguir:', err),
          });
        return;
      }
      const partial = this.mapStepDataToDto(this.activeWizardStep);
      if (partial) {
        this.caseService
          .updateCase(this.caseId, partial)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.activeWizardStep = Math.min(this.activeWizardStep + 1, 13);
            },
            error: (error) => {
              console.error('Error al guardar el paso', this.activeWizardStep, error);
            },
          });
        return;
      }
    }

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

    if (step === 1 && this.livesAlone) {
      return true;
    }

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

  downloadCasePdf(): void {
    if (!this.caseId) return;
    this.caseService
      .downloadCasePdf(this.caseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = `caso-${this.caseId}.pdf`;
          anchor.click();
          URL.revokeObjectURL(url);
        },
        error: () => this.notificationService.showError('Error al descargar el PDF del caso'),
      });
  }

  private closeCaseOnProcessCompleted(): void {
    if (!this.caseId) return;
    this.notificationService
      .showConfirmation('¿Está seguro de culminar el proceso de ayuda?', {
        text: 'El caso quedará cerrado y no podrá continuar con el registro.',
      })
      .then((result) => {
        if (!result.isConfirmed) return;
        this.caseService
          .updateCaseStatus(this.caseId!, CaseStatus.CLOSED)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.isCaseClosed = true;
              this.caseForm.disable();
              this.notificationService.showSuccess('El proceso de ayuda ha sido culminado. El caso está cerrado.');
              // Redirigir a la lista de casos
              setTimeout(() => {
                this.router.navigate(['/cases']);
              }, 1500);
            },
            error: (err) => console.error('Error al cerrar el caso:', err),
          });
      });
  }

  closeCaseFromFinalStep(): void {
    if (!this.caseId) return;
    this.notificationService
      .showConfirmation('¿Está seguro de cerrar el caso?', {
        text: 'Se guardarán los datos del formulario y el caso quedará cerrado.',
      })
      .then((result) => {
        if (result.isConfirmed) {
          const caseDto: CreateCaseDto = this.mapFormDataToDto();
          this.caseService
            .updateCase(this.caseId!, caseDto)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.caseService
                  .updateCaseStatus(this.caseId!, CaseStatus.CLOSED)
                  .pipe(takeUntil(this.destroy$))
                  .subscribe({
                    next: () => {
                      this.isCaseClosed = true;
                      this.caseForm.disable();
                      this.notificationService.showSuccess('El caso ha sido actualizado y cerrado exitosamente.');
                      // Redirigir a la lista de casos
                      setTimeout(() => {
                        this.router.navigate(['/cases']);
                      }, 1500);
                    },
                    error: (err) => console.error('Error al cerrar el caso:', err),
                  });
              },
              error: (err) => console.error('Error al actualizar el caso:', err),
            });
        }
      });
  }

  private createInitialCase(): void {
    // Validate steps 1-4
    const stepsToValidate = ['familyMembers', 'bioPsychosocialHistory', 'consultationReason', 'identifiedSituations'];
    const allValid = stepsToValidate.every((key) => this.caseForm.get(key)?.valid);
    if (!allValid) {
      this.notificationService.showWarning('Por favor complete todos los campos requeridos en los pasos anteriores');
      return;
    }

    const formValue = this.caseForm.getRawValue();
    const caseDto: CreateCaseDto = {
      participantId: this.participantId,
      familyMembers: formValue.livesAlone
        ? []
        : formValue.familyMembers.map((member: any) => ({
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
      intervention: '',
      followUpPlan: [],
      physicalHealthHistory: [],
      mentalHealthHistory: [],
      family_health_history: [
        { history_type: 'physical', familyHistoryFather: null, familyHistoryMother: null },
        { history_type: 'mental', familyHistoryFather: null, familyHistoryMother: null },
      ],
      weighing: {
        reasonConsultation: '',
        identifiedSituation: '',
        favorableConditions: '',
        conditionsNotFavorable: '',
        helpProcess: '',
      },
      interventionPlans: [],
      progressNotes: [],
      referrals: '',
    };

    this.isCreatingCase = true;
    this.caseService
      .createCase(caseDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.caseId = response.data.id;
          this.isEditMode = true;
          this.isCreatingCase = false;
          this.activeWizardStep = 5;
        },
        error: () => {
          this.isCreatingCase = false;
        },
      });
  }

  private mapStepDataToDto(step: number): Partial<CreateCaseDto> | null {
    const formValue = this.caseForm.getRawValue();
    switch (step) {
      case 5:
        return { intervention: formValue.intervention.action };
      case 6:
        return null; // followUpPlan no es aceptado por el endpoint PATCH /cases/:id
      case 7: {
        const hasPhysical = formValue.physicalHealthHistory.hasPhysicalHistory;
        return {
          physicalHealthHistory: hasPhysical
            ? formValue.physicalHealthHistory.conditions
                .filter((c: any) => c.condition || c.observations || (c.receivingTreatment && c.treatmentDetails))
                .map((c: any) => ({
                  currentConditions: c.condition || null,
                  medications: c.receivingTreatment ? c.treatmentDetails || null : null,
                  observations: c.observations || null,
                }))
            : [],
          family_health_history: [
            {
              history_type: 'physical' as const,
              familyHistoryFather: formValue.familyHealthHistory.physicalFamilyHistoryFather || null,
              familyHistoryMother: formValue.familyHealthHistory.physicalFamilyHistoryMother || null,
            },
          ],
        };
      }
      case 8: {
        const hasMental = formValue.mentalHealthHistory.hasMentalHistory;
        return {
          mentalHealthHistory: hasMental
            ? formValue.mentalHealthHistory.conditions
                .filter((c: any) => c.condition || c.observations || (c.receivingTreatment && c.treatmentDetails))
                .map((c: any) => ({
                  currentConditions: c.condition || null,
                  medications: c.receivingTreatment ? c.treatmentDetails || null : null,
                  observations: c.observations || null,
                }))
            : [],
          family_health_history: [
            {
              history_type: 'mental' as const,
              familyHistoryFather: formValue.familyHealthHistory.mentalFamilyHistoryFather || null,
              familyHistoryMother: formValue.familyHealthHistory.mentalFamilyHistoryMother || null,
            },
          ],
        };
      }
      case 9:
        return {
          weighing: {
            reasonConsultation: formValue.consultationReason.reason,
            identifiedSituation: formValue.identifiedSituations.situations.join(', '),
            favorableConditions: formValue.assessment.concurrentFactors,
            conditionsNotFavorable: formValue.assessment.criticalFactors,
            helpProcess: formValue.assessment.theoreticalFramework,
          },
        };
      case 10:
        return {
          interventionPlans: formValue.interventionPlan.interventions.map((i: any) => ({
            goal: i.goals,
            objectives: i.objectives,
            activities: i.activities,
            timeline: i.timeframe,
            responsible: i.responsiblePerson,
            evaluationCriteria: i.evaluationCriteria,
          })),
        };
      case 11:
        return {
          progressNotes: formValue.progressNotes.notes.map((n: any) => ({
            sessionDate: n.date,
            sessionType: n.approachType,
            summary: n.interventionSummary,
            agreements: n.agreements,
          })),
        };
      case 12:
        return { referrals: formValue.referrals.referralsJustification };
      default:
        return null;
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
          console.error('Error al crear el caso:', error);
        },
      });
  }

  private updateCase(caseDto: Partial<CreateCaseDto>): void {
    if (!this.caseId) return;

    this.caseService
      .updateCase(this.caseId, caseDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/participants/detail', this.participantId]);
        },
        error: (error) => {
          console.error('Error al actualizar el caso:', error);
        },
      });
  }

  private mapFormDataToDto(): CreateCaseDto {
    const formValue = this.caseForm.getRawValue();

    return {
      participantId: this.participantId,
      familyMembers: formValue.livesAlone
        ? []
        : formValue.familyMembers.map((member: any) => ({
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
        observations: condition.observations,
      })),
      mentalHealthHistory: formValue.mentalHealthHistory.conditions.map((condition: any) => ({
        currentConditions: condition.condition,
        medications: condition.receivingTreatment ? condition.treatmentDetails : null,
        observations: condition.observations,
      })),
      family_health_history: [
        {
          history_type: 'physical',
          familyHistoryFather: formValue.familyHealthHistory.physicalFamilyHistoryFather || null,
          familyHistoryMother: formValue.familyHealthHistory.physicalFamilyHistoryMother || null,
        },
        {
          history_type: 'mental',
          familyHistoryFather: formValue.familyHealthHistory.mentalFamilyHistoryFather || null,
          familyHistoryMother: formValue.familyHealthHistory.mentalFamilyHistoryMother || null,
        },
      ],
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
    if (field?.hasError('atLeastOneOption')) return 'Debe seleccionar al menos una opción del plan a seguir';
    if (field?.hasError('min')) return 'Valor mínimo no alcanzado';
    if (field?.hasError('max')) return 'Valor máximo excedido';
    return '';
  }

  // Progress calculation
  getProgressPercentage(): number {
    return (this.activeWizardStep / 11) * 100;
  }
}
