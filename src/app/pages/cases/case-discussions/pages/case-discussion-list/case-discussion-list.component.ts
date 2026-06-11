import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';

import { NotificationService } from '../../../../../core/services/notification.service';
import { RoleService } from '../../../../../core/services/role.service';
import { CaseDiscussion, CaseDiscussionStatus } from '../../models/case-discussion.models';
import { CaseDiscussionsService } from '../../services/case-discussions.service';

@Component({
  selector: 'app-case-discussion-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './case-discussion-list.component.html',
  styleUrls: ['./case-discussion-list.component.scss'],
})
export class CaseDiscussionListComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly caseDiscussionsService = inject(CaseDiscussionsService);
  private readonly notificationService = inject(NotificationService);
  private readonly roleService = inject(RoleService);
  private readonly destroy$ = new Subject<void>();

  readonly statusEnum = CaseDiscussionStatus;
  readonly downloadingIds = new Set<number>();

  caseId = 0;
  discussions: CaseDiscussion[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.caseId = Number(params.get('caseId'));
      this.loadDiscussions();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get canCreateDiscussion(): boolean {
    return this.roleService.hasAnyRole('ADMIN', 'COORDINADOR', 'ORIENTADOR', 'PSICOLOGO');
  }

  get hasAdminAccess(): boolean {
    return this.roleService.isAdmin();
  }

  loadDiscussions(): void {
    if (!this.caseId) {
      this.discussions = [];
      return;
    }

    this.isLoading = true;
    this.caseDiscussionsService
      .getDiscussionsByCase(this.caseId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (discussions) => {
          this.discussions = discussions;
        },
      });
  }

  canEdit(discussion: CaseDiscussion): boolean {
    return (
      discussion.status === CaseDiscussionStatus.DRAFT &&
      this.roleService.hasAnyRole('ADMIN', 'ORIENTADOR', 'PSICOLOGO')
    );
  }

  canView(discussion: CaseDiscussion): boolean {
    return (
      this.roleService.hasAnyRole('ADMIN', 'COORDINADOR', 'SUPERVISOR', 'ORIENTADOR', 'PSICOLOGO') && !!discussion.id
    );
  }

  downloadPdf(discussion: CaseDiscussion): void {
    if (!discussion.id || this.downloadingIds.has(discussion.id)) {
      return;
    }

    this.downloadingIds.add(discussion.id);
    this.caseDiscussionsService
      .downloadPdf(this.caseId, discussion.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.downloadingIds.delete(discussion.id);
        }),
      )
      .subscribe({
        next: (blob) => {
          this.saveBlob(blob, this.buildFileName(discussion));
        },
        error: () => {
          this.notificationService.showError('No se pudo descargar el PDF de la discusión del caso.');
        },
      });
  }

  getStatusBadgeClass(status: CaseDiscussionStatus): string {
    switch (status) {
      case CaseDiscussionStatus.DRAFT:
        return 'badge rounded-pill text-bg-warning';
      case CaseDiscussionStatus.FINALIZED:
        return 'badge rounded-pill text-bg-success';
      case CaseDiscussionStatus.ANNULLED:
        return 'badge rounded-pill text-bg-danger';
      default:
        return 'badge rounded-pill text-bg-secondary';
    }
  }

  private buildFileName(discussion: CaseDiscussion): string {
    return `discusion-caso-${discussion.caseNumber}-${discussion.discussionDate}.pdf`;
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
