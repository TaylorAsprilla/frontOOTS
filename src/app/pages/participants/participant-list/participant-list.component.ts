import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgbPaginationModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule } from '@ngneat/transloco';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

import { ParticipantService } from '../../../core/services/participant.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { Participant, ParticipantStatus } from '../../../core/interfaces/participant.interface';

@Component({
  selector: 'app-participant-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbDropdownModule,
    NgbTooltipModule,
    TranslocoModule,
    PageTitleComponent,
  ],
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.scss'],
})
export class ParticipantListComponent implements OnInit, OnDestroy {
  private readonly participantService = inject(ParticipantService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthenticationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  // Data and state
  participants: Participant[] = [];
  filteredParticipants: Participant[] = [];
  isLoading = false;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // Filters
  searchForm!: FormGroup;
  statusFilter: ParticipantStatus | 'all' = 'all';

  // Breadcrumb
  breadcrumbItems: BreadcrumbItem[] = [{ label: 'participants.title', active: true }];

  // Status options
  statusOptions: Array<{ value: ParticipantStatus | 'all'; label: string }> = [
    { value: 'all', label: 'participants.allStatuses' },
    { value: ParticipantStatus.ACTIVE, label: 'participants.active' },
    { value: ParticipantStatus.INACTIVE, label: 'participants.inactive' },
    { value: ParticipantStatus.DISCHARGED, label: 'participants.discharged' },
    { value: ParticipantStatus.TRANSFERRED, label: 'participants.transferred' },
  ];

  // Math utility for templates
  Math = Math;

  ngOnInit(): void {
    this.initializeSearchForm();
    this.setupSearchSubscription();
    this.loadParticipants();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeSearchForm(): void {
    this.searchForm = this.formBuilder.group({
      searchTerm: [''],
    });
  }

  private setupSearchSubscription(): void {
    this.searchForm
      .get('searchTerm')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage = 1;
        this.loadParticipants();
      });
  }

  loadParticipants(): void {
    this.isLoading = true;

    // Obtener el usuario actual
    const currentUser = this.authService.currentUser();

    if (!currentUser || !currentUser.id) {
      this.notificationService.showError('No se pudo obtener la información del usuario');
      this.isLoading = false;
      return;
    }

    // Usar el nuevo método que filtra por usuario (sin filtros adicionales en el backend)
    this.participantService
      .getParticipantsByUser(currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Obtener los participantes de la respuesta
          const allParticipants = response?.data?.participants || [];

          // Aplicar filtros localmente
          let filteredData = [...allParticipants];

          // Filtrar por búsqueda local
          const searchTerm = this.searchForm.get('searchTerm')?.value?.toLowerCase() || '';
          if (searchTerm) {
            filteredData = filteredData.filter(
              (participant) =>
                participant.firstName?.toLowerCase().includes(searchTerm) ||
                participant.firstLastName?.toLowerCase().includes(searchTerm) ||
                participant.secondLastName?.toLowerCase().includes(searchTerm) ||
                participant.email?.toLowerCase().includes(searchTerm) ||
                participant.documentNumber?.includes(searchTerm)
            );
          }

          // Filtrar por estado local
          if (this.statusFilter !== 'all') {
            filteredData = filteredData.filter((participant) => participant.status === this.statusFilter);
          }

          // Calcular total después de filtros
          this.totalItems = filteredData.length;

          // Aplicar paginación local
          const startIndex = (this.currentPage - 1) * this.pageSize;
          const endIndex = startIndex + this.pageSize;

          this.participants = allParticipants; // Guardar todos los participantes
          this.filteredParticipants = filteredData.slice(startIndex, endIndex); // Mostrar solo la página actual
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading participants:', error);
          this.participants = [];
          this.filteredParticipants = [];
          this.totalItems = 0;
          this.isLoading = false;
        },
      });
  }

  onStatusFilterChange(status: ParticipantStatus | 'all'): void {
    this.statusFilter = status;
    this.currentPage = 1;
    this.loadParticipants();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadParticipants();
  }

  deleteParticipant(participant: Participant): void {
    if (!participant.id) return;

    const participantName = `${participant.firstName} ${participant.firstLastName}`;

    this.notificationService.showDeleteConfirmation(participantName).then((result) => {
      if (result.isConfirmed && participant.id) {
        this.participantService
          .deleteParticipant(participant.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadParticipants();
            },
            error: (error) => {
              console.error('Error deleting participant:', error);
            },
          });
      }
    });
  }

  getStatusBadgeClass(status?: ParticipantStatus): string {
    switch (status) {
      case ParticipantStatus.ACTIVE:
        return 'badge bg-success';
      case ParticipantStatus.INACTIVE:
        return 'badge bg-secondary';
      case ParticipantStatus.DISCHARGED:
        return 'badge bg-info';
      case ParticipantStatus.TRANSFERRED:
        return 'badge bg-warning';
      default:
        return 'badge bg-secondary';
    }
  }

  getStatusLabel(status: ParticipantStatus | 'all'): string {
    const option = this.statusOptions.find((s) => s.value === status);
    return option?.label || 'participants.unknown';
  }

  clearSearch(): void {
    this.searchForm.patchValue({ searchTerm: '' });
    this.statusFilter = 'all';
    this.currentPage = 1;
    this.loadParticipants();
  }
}
