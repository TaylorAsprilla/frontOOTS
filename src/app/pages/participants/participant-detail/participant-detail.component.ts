import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';

import { ParticipantService } from '../../../core/services/participant.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { Participant } from '../../../core/interfaces/participant.interface';

@Component({
  selector: 'app-participant-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule, PageTitleComponent],
  templateUrl: './participant-detail.component.html',
  styleUrls: ['./participant-detail.component.scss'],
})
export class ParticipantDetailComponent implements OnInit, OnDestroy {
  private readonly participantService = inject(ParticipantService);
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();

  participant: Participant | null = null;
  isLoading = false;
  participantId: string | null = null;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'participants.title', active: false },
    { label: 'participants.detail', active: true },
  ];

  ngOnInit(): void {
    this.participantId = this.route.snapshot.paramMap.get('id');
    if (this.participantId) {
      this.loadParticipant();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadParticipant(): void {
    if (!this.participantId) return;

    this.isLoading = true;
    this.participantService
      .getParticipantById(this.participantId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.participant = response.data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading participant:', error);
          this.notificationService.showError('participants.errorLoading');
          this.isLoading = false;
        },
      });
  }
}
