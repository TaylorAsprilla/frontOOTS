import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService, SimpleNotification } from '../../../core/services/notification.service';

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

  notifications: (SimpleNotification & { id: number })[] = [];
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

  private addNotification(notification: SimpleNotification): void {
    const id = ++this.notificationId;
    const notificationWithId = { ...notification, id };

    this.notifications.push(notificationWithId);

    // Auto-remove after duration (default 5 seconds if not specified)
    const duration = notification.duration || 5000;
    setTimeout(() => {
      this.removeNotificationById(id);
    }, duration);
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
