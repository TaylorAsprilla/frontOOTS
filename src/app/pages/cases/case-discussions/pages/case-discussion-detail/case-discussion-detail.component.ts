import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';

import { NotificationService } from '../../../../../core/services/notification.service';
import { RoleService } from '../../../../../core/services/role.service';
import { CaseDiscussion, CaseDiscussionStatus } from '../../models/case-discussion.models';
import { CaseDiscussionsService } from '../../services/case-discussions.service';

@Component({
  selector: 'app-case-discussion-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './case-discussion-detail.component.html',
  styleUrls: ['./case-discussion-detail.component.scss'],
})
export class CaseDiscussionDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly caseDiscussionsService = inject(CaseDiscussionsService);
  private readonly notificationService = inject(NotificationService);
  private readonly roleService = inject(RoleService);
  private readonly destroy$ = new Subject<void>();

  discussion?: CaseDiscussion;
  caseId = 0;
  discussionId = 0;
  isLoading = false;
  isDownloadingPdf = false;

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.caseId = Number(params.get('caseId'));
      this.discussionId = Number(params.get('discussionId'));
      this.loadDiscussion();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get canEdit(): boolean {
    return (
      !!this.discussion &&
      this.discussion.status === CaseDiscussionStatus.DRAFT &&
      this.roleService.hasAnyRole('ADMIN', 'ORIENTADOR', 'PSICOLOGO')
    );
  }

  get canAnnul(): boolean {
    return !!this.discussion && this.discussion.status !== CaseDiscussionStatus.ANNULLED && this.roleService.isAdmin();
  }

  loadDiscussion(): void {
    this.isLoading = true;
    this.caseDiscussionsService
      .getDiscussionById(this.caseId, this.discussionId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (discussion) => {
          this.discussion = discussion;
        },
      });
  }

  downloadPdf(): void {
    if (!this.discussion || this.isDownloadingPdf) {
      return;
    }

    this.isDownloadingPdf = true;
    this.caseDiscussionsService
      .downloadPdf(this.caseId, this.discussion.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isDownloadingPdf = false;
        }),
      )
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = `discusion-caso-${this.discussion?.caseNumber}-${this.discussion?.discussionDate}.pdf`;
          anchor.click();
          URL.revokeObjectURL(url);
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
}
