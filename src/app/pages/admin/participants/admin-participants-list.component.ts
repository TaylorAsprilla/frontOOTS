import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule } from '@ngneat/transloco';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

import { AdminParticipantsService } from '../../../core/services/admin-participants.service';
import { AdminParticipant } from '../../../core/interfaces/admin-participant.interface';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { LocalizedDatePipe } from '../../../core/pipes/localized-date.pipe';
import {
  participantFullName, assignedUserFullName, participantLocation, messagingPhone, participantEmailLink,
} from '../../../shared/participant-table-helpers';

@Component({
  selector: 'app-admin-participants-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTooltipModule,
    TranslocoModule,
    PageTitleComponent,
    LocalizedDatePipe,
  ],
  templateUrl: './admin-participants-list.component.html',
  styleUrls: ['./admin-participants-list.component.scss'],
})
export class AdminParticipantsListComponent implements OnInit, OnDestroy {
  private readonly adminParticipantsService = inject(AdminParticipantsService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  // Estado
  participants: AdminParticipant[] = [];
  filteredParticipants: AdminParticipant[] = [];
  pageItems: AdminParticipant[] = [];
  total = 0;
  isLoading = false;
  hasError = false;
  errorMessage = '';

  // Paginación local
  currentPage = 1;
  pageSize = 10;

  // Búsqueda
  searchForm!: FormGroup;

  // Breadcrumb
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'adminParticipants.breadcrumbAdmin', active: false },
    { label: 'adminParticipants.breadcrumbParticipants', active: true },
  ];

  // Math utility for templates
  Math = Math;

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({ searchTerm: [''] });

    this.searchForm
      .get('searchTerm')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage = 1;
        this.applyFilters();
      });

    this.loadParticipants();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadParticipants(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    this.adminParticipantsService
      .getAllParticipants()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const list = Array.isArray(response?.data) ? response.data : [];
          this.participants = list;
          this.total = typeof response?.total === 'number' ? response.total : list.length;
          this.currentPage = 1;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          this.participants = [];
          this.filteredParticipants = [];
          this.pageItems = [];
          this.total = 0;
          this.hasError = true;
          this.errorMessage = error?.error?.message || error?.message || '';
          this.isLoading = false;
        },
      });
  }

  /** Aplica el filtro local de búsqueda y recalcula la página actual. */
  private applyFilters(): void {
    const term = (this.searchForm?.get('searchTerm')?.value ?? '').toString().trim().toLowerCase();

    if (!term) {
      this.filteredParticipants = [...this.participants];
    } else {
      this.filteredParticipants = this.participants.filter((p) => {
        const fullName = this.getParticipantFullName(p).toLowerCase();
        const assigned = this.getAssignedUserFullName(p).toLowerCase();
        const document = (p.documentNumber ?? '').toLowerCase();
        const email = (p.email ?? '').toLowerCase();
        const assignedEmail = (p.registeredBy?.email ?? '').toLowerCase();

        return (
          fullName.includes(term) ||
          assigned.includes(term) ||
          document.includes(term) ||
          email.includes(term) ||
          assignedEmail.includes(term)
        );
      });
    }

    this.recalculatePage();
  }

  private recalculatePage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pageItems = this.filteredParticipants.slice(start, start + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.recalculatePage();
  }

  clearSearch(): void {
    this.searchForm.patchValue({ searchTerm: '' });
  }

  /** Concatena nombres del participante saltando valores null/undefined/vacíos. */
  getParticipantFullName = participantFullName;

  /**
   * Nombre completo del usuario que registró o tiene asignado el participante.
   * Si no existe `registeredBy`, devuelve cadena vacía (la plantilla muestra "Sin asignar").
   */
  getAssignedUserFullName = assignedUserFullName;

  /** Ciudad / Estado en una sola celda. */
  getLocation = participantLocation;
  getMessagingPhone = messagingPhone;
  getEmailLink = participantEmailLink;

  trackById(_index: number, item: AdminParticipant): number {
    return item.id;
  }
}
