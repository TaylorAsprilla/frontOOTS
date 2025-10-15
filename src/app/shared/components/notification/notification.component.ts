import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';

interface Notification {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent implements OnInit, OnDestroy {
  private readonly notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();

  notifications: (Notification & { id: number })[] = [];
  private notificationId = 0;

  ngOnInit(): void {
    this.notificationService.notifications$.pipe(takeUntil(this.destroy$)).subscribe((notification) => {
      this.addNotification(notification);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private addNotification(notification: Notification): void {
    const id = ++this.notificationId;
    const notificationWithId = { ...notification, id };

    this.notifications.push(notificationWithId);

    // Auto-remove after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.removeNotificationById(id);
      }, notification.duration);
    }
  }

  removeNotification(index: number): void {
    if (index >= 0 && index < this.notifications.length) {
      this.notifications.splice(index, 1);
    }
  }

  private removeNotificationById(id: number): void {
    const index = this.notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.removeNotification(index);
    }
  }
}
