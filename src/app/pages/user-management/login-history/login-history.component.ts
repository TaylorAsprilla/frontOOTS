import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';

import { AuthenticationService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { LoginHistoryEntry } from '../../../core/interfaces/auth.interface';

@Component({
  selector: 'app-login-history',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule, TranslocoModule, PageTitleComponent],
  templateUrl: './login-history.component.html',
  styleUrls: ['./login-history.component.scss'],
})
export class LoginHistoryComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthenticationService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  entries: LoginHistoryEntry[] = [];
  isLoading = true;
  currentPage = 1;
  pageSize = 20;
  totalItems = 0;

  breadcrumbItems: BreadcrumbItem[] = [{ label: 'auth.loginHistory.title', active: true }];

  ngOnInit(): void {
    this.loadHistory();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadHistory(): void {
    this.isLoading = true;
    this.authService
      .getLoginHistory(this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.entries = response.data;
          this.totalItems = response.total;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.notificationService.showError('Error al cargar el historial de accesos');
        },
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadHistory();
  }

  getRiskBadgeClass(risk: 'LOW' | 'MEDIUM' | 'HIGH'): string {
    const map: Record<string, string> = {
      LOW: 'bg-success',
      MEDIUM: 'bg-warning text-dark',
      HIGH: 'bg-danger',
    };
    return map[risk] ?? 'bg-secondary';
  }
}
