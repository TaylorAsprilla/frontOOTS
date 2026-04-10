import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule } from '@ngneat/transloco';
import { Subject, takeUntil, debounceTime } from 'rxjs';

import { AuditService } from '../../../core/services/audit.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { AuditLog, AuditAction } from '../../../core/interfaces/auth.interface';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbPaginationModule, TranslocoModule, PageTitleComponent],
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss'],
})
export class AuditLogsComponent implements OnInit, OnDestroy {
  private readonly auditService = inject(AuditService);
  private readonly notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  logs: AuditLog[] = [];
  isLoading = true;
  currentPage = 1;
  pageSize = 50;
  totalItems = 0;

  filterForm!: FormGroup;

  readonly actionOptions: AuditAction[] = [
    'CREATE',
    'UPDATE',
    'DELETE',
    'LOGIN',
    'LOGOUT',
    'PASSWORD_CHANGE',
    'PASSWORD_RESET',
    'STATUS_CHANGE',
  ];

  breadcrumbItems: BreadcrumbItem[] = [{ label: 'audit.title', active: true }];

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      userId: [''],
      action: [''],
      endpoint: [''],
      dateFrom: [''],
      dateTo: [''],
    });
    this.loadLogs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLogs(): void {
    this.isLoading = true;
    const { userId, action, endpoint, dateFrom, dateTo } = this.filterForm.value;

    this.auditService
      .getLogs({
        userId: userId || undefined,
        action: action || undefined,
        endpoint: endpoint || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        page: this.currentPage,
        limit: this.pageSize,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.logs = response.data;
          this.totalItems = response.total;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.notificationService.showError('Error al cargar los registros de auditoría');
        },
      });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadLogs();
  }

  clearFilters(): void {
    this.filterForm.reset({ userId: '', action: '', endpoint: '', dateFrom: '', dateTo: '' });
    this.currentPage = 1;
    this.loadLogs();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadLogs();
  }

  getStatusBadgeClass(status: number): string {
    if (status >= 200 && status < 300) return 'bg-success';
    if (status >= 400 && status < 500) return 'bg-warning text-dark';
    if (status >= 500) return 'bg-danger';
    return 'bg-secondary';
  }

  getActionBadgeClass(action: AuditAction): string {
    const map: Partial<Record<AuditAction, string>> = {
      CREATE: 'bg-success',
      UPDATE: 'bg-primary',
      DELETE: 'bg-danger',
      LOGIN: 'bg-info',
      LOGOUT: 'bg-secondary',
      PASSWORD_CHANGE: 'bg-warning text-dark',
      PASSWORD_RESET: 'bg-warning text-dark',
      STATUS_CHANGE: 'bg-purple',
    };
    return map[action] ?? 'bg-secondary';
  }
}
