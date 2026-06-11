import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';

import { NotificationService } from '../../../../../core/services/notification.service';
import { RoleService } from '../../../../../core/services/role.service';
import { TokenStorageService } from '../../../../../core/services/token-storage.service';
import { CaseDiscussionFamilyTableComponent } from '../../components/case-discussion-family-table/case-discussion-family-table.component';
import {
  CaseDiscussion,
  CaseDiscussionStatus,
  CreateCaseDiscussionRequest,
  UpdateCaseDiscussionRequest,
} from '../../models/case-discussion.models';
import { CaseDiscussionsService } from '../../services/case-discussions.service';

@Component({
  selector: 'app-case-discussion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CaseDiscussionFamilyTableComponent],
  templateUrl: './case-discussion-form.component.html',
  styleUrls: ['./case-discussion-form.component.scss'],
})
export class CaseDiscussionFormComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  readonly roleService = inject(RoleService);
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly caseDiscussionsService = inject(CaseDiscussionsService);
  private readonly destroy$ = new Subject<void>();

  readonly statusEnum = CaseDiscussionStatus;

  caseId = 0;
  discussionId?: number;
  isEditMode = false;
  isLoading = false;
  isSubmitting = false;
  isDownloadingPdf = false;
  submitted = false;
  allowClientDataEdition = true;
  loadedDiscussion?: CaseDiscussion;

  discussionForm: FormGroup = this.formBuilder.group({
    general: this.formBuilder.group({
      caseNumber: [''],
      participantId: [null],
      participantName: [''],
      socialWorkerName: [''],
      supervisorName: ['', Validators.required],
      discussionDate: ['', Validators.required],
      status: [CaseDiscussionStatus.DRAFT, Validators.required],
    }),
    client: this.formBuilder.group({
      clientName: [''],
      clientAge: [null],
      clientSex: [''],
      clientMaritalStatus: [''],
    }),
    familyMembers: this.formBuilder.array<FormGroup>([]),
    development: this.formBuilder.group({
      presentingSituations: ['', Validators.required],
      affectedPeople: [''],
      socialWorkerRecommendations: [''],
      supervisorRecommendations: [''],
    }),
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.caseId = Number(params.get('caseId'));
      this.discussionId = params.get('discussionId') ? Number(params.get('discussionId')) : undefined;
      this.isEditMode = !!this.discussionId;
      this.initializeDefaults();

      if (this.discussionId) {
        this.loadDiscussion(this.discussionId);
      } else {
        this.applyFieldAccess();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get familyMembers(): FormArray<FormGroup> {
    return this.discussionForm.get('familyMembers') as FormArray<FormGroup>;
  }

  get isReadOnly(): boolean {
    const status = this.generalGroup.get('status')?.value as CaseDiscussionStatus;
    return status === CaseDiscussionStatus.FINALIZED && !this.roleService.isAdmin();
  }

  get canAnnul(): boolean {
    return !!this.discussionId && this.roleService.isAdmin() && !this.isSubmitting;
  }

  get canEditDraft(): boolean {
    if (this.roleService.isAdmin()) {
      return true;
    }

    return this.roleService.hasAnyRole('COORDINADOR', 'ORIENTADOR', 'PSICOLOGO', 'SUPERVISOR');
  }

  get generalGroup(): FormGroup {
    return this.discussionForm.get('general') as FormGroup;
  }

  get clientGroup(): FormGroup {
    return this.discussionForm.get('client') as FormGroup;
  }

  get developmentGroup(): FormGroup {
    return this.discussionForm.get('development') as FormGroup;
  }

  addFamilyMember(): void {
    this.familyMembers.push(this.buildFamilyMemberGroup());
  }

  removeFamilyMember(index: number): void {
    this.familyMembers.removeAt(index);
  }

  saveDraft(): void {
    this.submit(false);
  }

  finalizeDiscussion(): void {
    this.notificationService
      .showConfirmation('Se finalizará la discusión y quedará en modo solo lectura para perfiles no administradores.', {
        title: 'Finalizar discusión',
        confirmButtonText: 'Sí, finalizar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.submit(true);
        }
      });
  }

  annulDiscussion(): void {
    if (!this.discussionId) {
      return;
    }

    const discussionId = this.discussionId;

    this.notificationService
      .showConfirmation('La discusión se marcará como anulada y dejará de ser editable.', {
        title: 'Anular discusión',
        confirmButtonText: 'Sí, anular',
      })
      .then((result) => {
        if (!result.isConfirmed) {
          return;
        }

        this.isSubmitting = true;
        this.caseDiscussionsService
          .annulDiscussion(this.caseId, discussionId)
          .pipe(
            takeUntil(this.destroy$),
            finalize(() => {
              this.isSubmitting = false;
            }),
          )
          .subscribe({
            next: (discussion) => {
              this.loadedDiscussion = discussion;
              this.patchDiscussion(discussion);
              this.applyFieldAccess();
              this.notificationService.showSuccess('La discusión fue anulada exitosamente.');
            },
          });
      });
  }

  downloadPdf(): void {
    if (!this.discussionId || this.isDownloadingPdf) {
      return;
    }

    this.isDownloadingPdf = true;
    this.caseDiscussionsService
      .downloadPdf(this.caseId, this.discussionId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isDownloadingPdf = false;
        }),
      )
      .subscribe({
        next: (blob) => {
          const discussion = this.loadedDiscussion;
          const date = discussion?.discussionDate ?? new Date().toISOString().slice(0, 10);
          const caseNumber = discussion?.caseNumber ?? this.generalGroup.get('caseNumber')?.value ?? this.caseId;
          this.saveBlob(blob, `discusion-caso-${caseNumber}-${date}.pdf`);
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/cases', this.caseId, 'discussions']);
  }

  private initializeDefaults(): void {
    const currentUser = this.tokenStorageService.getUser();
    const socialWorkerName = [currentUser?.firstName, currentUser?.firstLastName].filter(Boolean).join(' ').trim();

    this.discussionForm.reset({
      general: {
        caseNumber: `CASO-${String(this.caseId || 0).padStart(4, '0')}`,
        participantId: null,
        participantName: 'Participante pendiente de API',
        socialWorkerName: socialWorkerName || 'Trabajador social asignado',
        supervisorName: '',
        discussionDate: new Date().toISOString().slice(0, 10),
        status: CaseDiscussionStatus.DRAFT,
      },
      client: {
        clientName: 'Cliente precargado desde participante',
        clientAge: null,
        clientSex: '',
        clientMaritalStatus: '',
      },
      development: {
        presentingSituations: '',
        affectedPeople: '',
        socialWorkerRecommendations: '',
        supervisorRecommendations: '',
      },
    });

    this.familyMembers.clear();
    this.addFamilyMember();
  }

  private loadDiscussion(discussionId: number): void {
    this.isLoading = true;
    this.caseDiscussionsService
      .getDiscussionById(this.caseId, discussionId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (discussion) => {
          this.loadedDiscussion = discussion;
          this.patchDiscussion(discussion);
          this.applyFieldAccess();
        },
      });
  }

  private patchDiscussion(discussion: CaseDiscussion): void {
    this.generalGroup.patchValue({
      caseNumber: discussion.caseNumber,
      participantId: discussion.participantId ?? null,
      participantName: discussion.participantName,
      socialWorkerName: discussion.socialWorkerName,
      supervisorName: discussion.supervisorName,
      discussionDate: discussion.discussionDate,
      status: discussion.status,
    });

    this.clientGroup.patchValue({
      clientName: discussion.clientName,
      clientAge: discussion.clientAge,
      clientSex: discussion.clientSex,
      clientMaritalStatus: discussion.clientMaritalStatus,
    });

    this.developmentGroup.patchValue({
      presentingSituations: discussion.presentingSituations,
      affectedPeople: discussion.affectedPeople,
      socialWorkerRecommendations: discussion.socialWorkerRecommendations,
      supervisorRecommendations: discussion.supervisorRecommendations,
    });

    this.familyMembers.clear();
    if (discussion.familyMembers.length) {
      discussion.familyMembers.forEach((member) => {
        this.familyMembers.push(this.buildFamilyMemberGroup(member));
      });
    } else {
      this.addFamilyMember();
    }
  }

  private applyFieldAccess(): void {
    const status = this.generalGroup.get('status')?.value as CaseDiscussionStatus;
    const isSupervisor = this.roleService.isSupervisor();
    const isAdmin = this.roleService.isAdmin();
    const controls = [this.generalGroup, this.clientGroup, this.developmentGroup, this.familyMembers];

    controls.forEach((control) => control.enable({ emitEvent: false }));

    if (status === CaseDiscussionStatus.ANNULLED || (status === CaseDiscussionStatus.FINALIZED && !isAdmin)) {
      this.discussionForm.disable({ emitEvent: false });
      return;
    }

    if (isSupervisor && !isAdmin) {
      this.generalGroup.disable({ emitEvent: false });
      this.clientGroup.disable({ emitEvent: false });
      this.familyMembers.disable({ emitEvent: false });
      this.developmentGroup.disable({ emitEvent: false });
      this.developmentGroup.get('supervisorRecommendations')?.enable({ emitEvent: false });
      return;
    }

    if (!this.canEditDraft && !isAdmin) {
      this.discussionForm.disable({ emitEvent: false });
      return;
    }

    if (!this.allowClientDataEdition) {
      this.clientGroup.disable({ emitEvent: false });
    }
  }

  private submit(asFinalize: boolean): void {
    if (this.isSubmitting || this.isReadOnly || !this.canEditDraft) {
      return;
    }

    this.submitted = true;
    if (asFinalize) {
      this.developmentGroup.get('socialWorkerRecommendations')?.addValidators(Validators.required);
      this.developmentGroup.get('supervisorRecommendations')?.addValidators(Validators.required);
      this.developmentGroup.get('socialWorkerRecommendations')?.updateValueAndValidity();
      this.developmentGroup.get('supervisorRecommendations')?.updateValueAndValidity();
    }

    this.discussionForm.markAllAsTouched();
    if (this.discussionForm.invalid) {
      this.notificationService.showWarning('Completa los campos requeridos antes de continuar.');
      return;
    }

    const payload = this.buildPayload(asFinalize);
    this.isSubmitting = true;

    const request$ = this.discussionId
      ? this.caseDiscussionsService.updateDiscussion(
          this.caseId,
          this.discussionId,
          payload as UpdateCaseDiscussionRequest,
        )
      : this.caseDiscussionsService.createDiscussion(this.caseId, payload as CreateCaseDiscussionRequest);

    request$
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isSubmitting = false;
        }),
      )
      .subscribe({
        next: (discussion) => {
          this.loadedDiscussion = discussion;
          this.discussionId = discussion.id;

          if (asFinalize && this.discussionId) {
            this.caseDiscussionsService
              .finalizeDiscussion(this.caseId, this.discussionId)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (finalized) => {
                  this.loadedDiscussion = finalized;
                  this.patchDiscussion(finalized);
                  this.applyFieldAccess();
                  this.notificationService.showSuccess('La discusión fue finalizada exitosamente.');
                  this.router.navigate(['/cases', this.caseId, 'discussions', this.discussionId]);
                },
              });
            return;
          }

          this.patchDiscussion(discussion);
          this.applyFieldAccess();
          this.notificationService.showSuccess(
            this.isEditMode || this.discussionId
              ? 'La discusión fue actualizada exitosamente.'
              : 'La discusión fue creada exitosamente.',
          );

          if (!this.isEditMode && this.discussionId) {
            this.router.navigate(['/cases', this.caseId, 'discussions', this.discussionId, 'edit']);
          }
        },
      });
  }

  private buildPayload(asFinalize: boolean): CreateCaseDiscussionRequest | UpdateCaseDiscussionRequest {
    return {
      participantId: this.generalGroup.get('participantId')?.value,
      participantName: this.generalGroup.get('participantName')?.value,
      caseNumber: this.generalGroup.get('caseNumber')?.value,
      socialWorkerName: this.generalGroup.get('socialWorkerName')?.value,
      supervisorName: this.generalGroup.get('supervisorName')?.value,
      discussionDate: this.generalGroup.get('discussionDate')?.value,
      status: asFinalize
        ? CaseDiscussionStatus.FINALIZED
        : (this.generalGroup.get('status')?.value as CaseDiscussionStatus),
      clientName: this.clientGroup.get('clientName')?.value,
      clientAge: this.parseNullableNumber(this.clientGroup.get('clientAge')?.value),
      clientSex: this.clientGroup.get('clientSex')?.value,
      clientMaritalStatus: this.clientGroup.get('clientMaritalStatus')?.value,
      familyMembers: this.familyMembers.getRawValue().map((member: any, index: number) => ({
        id: member.id ?? index + 1,
        name: member.name,
        age: this.parseNullableNumber(member.age),
        relationship: member.relationship,
        occupation: member.occupation,
      })),
      presentingSituations: this.developmentGroup.get('presentingSituations')?.value,
      affectedPeople: this.developmentGroup.get('affectedPeople')?.value,
      socialWorkerRecommendations: this.developmentGroup.get('socialWorkerRecommendations')?.value,
      supervisorRecommendations: this.developmentGroup.get('supervisorRecommendations')?.value,
    };
  }

  private buildFamilyMemberGroup(
    member?: Partial<{ id: number; name: string; age: number | null; relationship: string; occupation: string }>,
  ): FormGroup {
    return this.formBuilder.group(
      {
        id: [member?.id ?? null],
        name: [member?.name ?? ''],
        age: [member?.age ?? null],
        relationship: [member?.relationship ?? ''],
        occupation: [member?.occupation ?? ''],
      },
      { validators: [this.familyMemberValidator()] },
    );
  }

  private familyMemberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control as FormGroup;
      const name = String(group.get('name')?.value ?? '').trim();
      const age = group.get('age')?.value;
      const relationship = String(group.get('relationship')?.value ?? '').trim();
      const occupation = String(group.get('occupation')?.value ?? '').trim();
      const hasAnyValue = !!name || (age !== null && age !== '') || !!relationship || !!occupation;

      if (!hasAnyValue) {
        return null;
      }

      const errors: ValidationErrors = {};
      if (!name) {
        errors['nameRequired'] = true;
        group.get('name')?.setErrors({ required: true });
      }
      if (!relationship) {
        errors['relationshipRequired'] = true;
        group.get('relationship')?.setErrors({ required: true });
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

  private parseNullableNumber(value: unknown): number | null {
    if (value === null || value === '' || value === undefined) {
      return null;
    }

    return Number(value);
  }

  private saveBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
