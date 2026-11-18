import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { CaseService } from '../../../core/services/case.service';
import { CaseTransfer, SubmitTransferReportDto } from '../../../core/interfaces/case.interface';
import { NotificationService } from '../../../core/services/notification.service';
import { LocalizedDatePipe } from '../../../core/pipes/localized-date.pipe';

/**
 * Paso 2 de la transferencia: el profesional que tiene el caso actualmente
 * elabora el informe de transferencia, que luego aprueba supervisión.
 */
@Component({
  selector: 'app-transfer-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, LocalizedDatePipe],
  templateUrl: './transfer-reports.component.html',
})
export class TransferReportsComponent implements OnInit, OnDestroy {
  private readonly caseService = inject(CaseService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  transfers: CaseTransfer[] = [];
  isLoading = false;
  busyId: number | null = null;
  forms: Record<number, SubmitTransferReportDto> = {};

  readonly fields: { key: keyof SubmitTransferReportDto; label: string; placeholder: string }[] = [
    { key: 'workSummary', label: 'Resumen de la labor realizada', placeholder: 'Describa la labor realizada con el participante...' },
    { key: 'assessment', label: 'Ponderación', placeholder: 'Ponderación del caso...' },
    { key: 'achievements', label: 'Logros', placeholder: 'Logros alcanzados...' },
    { key: 'recommendations', label: 'Recomendaciones', placeholder: 'Recomendaciones para el nuevo profesional...' },
  ];

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
      .getAwaitingReportTransfers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transfers) => {
          this.transfers = transfers;
          transfers.forEach((transfer) => {
            this.forms[transfer.id] ??= { workSummary: '', assessment: '', achievements: '', recommendations: '' };
          });
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  submit(transfer: CaseTransfer): void {
    if (this.busyId !== null) return;
    const form = this.forms[transfer.id];
    const missing = this.fields.find((field) => !form[field.key].trim());
    if (missing) {
      this.notificationService.showWarning(`Complete: ${missing.label}`);
      return;
    }
    this.busyId = transfer.id;
    this.caseService
      .submitTransferReport(transfer.caseId, transfer.id, {
        workSummary: form.workSummary.trim(),
        assessment: form.assessment.trim(),
        achievements: form.achievements.trim(),
        recommendations: form.recommendations.trim(),
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.busyId = null;
          this.load();
        },
        error: () => (this.busyId = null),
      });
  }

  personName(person?: { firstName?: string; firstLastName?: string } | null): string {
    if (!person) return '—';
    return [person.firstName, person.firstLastName].filter(Boolean).join(' ') || '—';
  }
}
