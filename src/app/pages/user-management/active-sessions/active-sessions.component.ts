import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';

import { AuthenticationService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { ActiveSession } from '../../../core/interfaces/auth.interface';

@Component({
  selector: 'app-active-sessions',
  standalone: true,
  imports: [CommonModule, TranslocoModule, PageTitleComponent],
  templateUrl: './active-sessions.component.html',
  styleUrls: ['./active-sessions.component.scss'],
})
export class ActiveSessionsComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthenticationService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  sessions: ActiveSession[] = [];
  isLoading = true;

  breadcrumbItems: BreadcrumbItem[] = [{ label: 'auth.sessions.title', active: true }];

  ngOnInit(): void {
    this.loadSessions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSessions(): void {
    this.isLoading = true;
    this.authService
      .getActiveSessions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (sessions) => {
          this.sessions = sessions;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.notificationService.showError('Error al cargar las sesiones activas');
        },
      });
  }
}
