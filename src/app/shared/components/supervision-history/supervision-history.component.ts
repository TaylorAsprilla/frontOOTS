import { Component, Input, OnChanges, OnDestroy, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { SupervisionReview, SupervisionService } from '../../../core/services/supervision.service';
import { RoleService } from '../../../core/services/role.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LocalizedDatePipe } from '../../../core/pipes/localized-date.pipe';

/**
 * Historial de revisiones de supervisión de un expediente (caso). Solo lo ven
 * SUPERVISOR, ADMIN y ADMIN_COUNTRY (este último solo su país; lo valida el backend).
 */
@Component({
  selector: 'app-supervision-history',
  standalone: true,
  imports: [CommonModule, RouterLink, LocalizedDatePipe],
  templateUrl: './supervision-history.component.html',
})
export class SupervisionHistoryComponent implements OnChanges, OnDestroy {
  private readonly service = inject(SupervisionService);
  private readonly roleService = inject(RoleService);
  private readonly notifications = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  @Input({ required: true }) caseId!: number;

  readonly visible = this.roleService.canViewSupervision();
  readonly canCreate = this.roleService.canSupervise();
  reviews: SupervisionReview[] = [];
  isLoading = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['caseId'] && this.caseId && this.visible) this.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private load(): void {
    this.isLoading = true;
    this.service
      .list({ type: 'CASE_FILE', caseId: this.caseId })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rows) => {
          this.reviews = rows;
          this.isLoading = false;
        },
        error: () => (this.isLoading = false),
      });
  }

  downloadPdf(review: SupervisionReview): void {
    this.service
      .downloadPdf(review.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = `revision-supervision-${review.id}.pdf`;
          anchor.click();
          URL.revokeObjectURL(url);
        },
        error: () => this.notifications.showError('No fue posible descargar el PDF'),
      });
  }

  reviewerName(review: SupervisionReview): string {
    return [review.reviewer?.firstName, review.reviewer?.firstLastName].filter(Boolean).join(' ') || '—';
  }
}
