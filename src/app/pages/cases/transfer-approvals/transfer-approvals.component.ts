import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { CaseService } from '../../../core/services/case.service';
import { CaseTransfer } from '../../../core/interfaces/case.interface';
import { NotificationService } from '../../../core/services/notification.service';
import { LocalizedDatePipe } from '../../../core/pipes/localized-date.pipe';

/**
 * Bandeja de informes de transferencia pendientes de aprobación
 * (SUPERVISOR, ADMIN y ADMIN_COUNTRY para casos de su país).
 */
@Component({
  selector: 'app-transfer-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule, LocalizedDatePipe],
  templateUrl: './transfer-approvals.component.html',
})
export class TransferApprovalsComponent implements OnInit, OnDestroy {
  private readonly caseService = inject(CaseService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  transfers: CaseTransfer[] = [];
  isLoading = false;
  busyId: number | null = null;
  notes: Record<number, string> = {};

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.isLoading = true;
    this.caseService
      .getPendingTransfers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transfers) => {
          this.transfers = transfers;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  approve(transfer: CaseTransfer): void {
    if (this.busyId !== null) return;
    this.busyId = transfer.id;
    this.caseService
      .approveTransfer(transfer.caseId, transfer.id, this.notes[transfer.id]?.trim() || undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.afterReview(),
        error: () => (this.busyId = null),
      });
  }

  reject(transfer: CaseTransfer): void {
    if (this.busyId !== null) return;
    const note = this.notes[transfer.id]?.trim();
    if (!note) {
      this.notificationService.showWarning('Indique el motivo del rechazo en la observación');
      return;
    }
    this.busyId = transfer.id;
    this.caseService
      .rejectTransfer(transfer.caseId, transfer.id, note)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.afterReview(),
        error: () => (this.busyId = null),
      });
  }

  downloadPdf(transfer: CaseTransfer): void {
    this.caseService
      .downloadTransferPdf(transfer.caseId, transfer.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = `informe-transferencia-${transfer.id}.pdf`;
          anchor.click();
          URL.revokeObjectURL(url);
        },
        error: () => this.notificationService.showError('No fue posible descargar el informe en PDF'),
      });
  }

  personName(person?: { firstName?: string; firstLastName?: string } | null): string {
    if (!person) return '—';
    return [person.firstName, person.firstLastName].filter(Boolean).join(' ') || '—';
  }

  private afterReview(): void {
    this.busyId = null;
    this.load();
  }
}
