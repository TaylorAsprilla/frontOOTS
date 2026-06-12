import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule } from '@ngneat/transloco';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

import { AdminCasesService } from '../../../core/services/admin-cases.service';
import { AdminCase, AdminCaseParticipant, AdminCaseProfessional } from '../../../core/interfaces/admin-case.interface';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { LocalizedDatePipe } from '../../../core/pipes/localized-date.pipe';

@Component({
  selector: 'app-admin-cases-list',
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
  templateUrl: './admin-cases-list.component.html',
  styleUrls: ['./admin-cases-list.component.scss'],
})
export class AdminCasesListComponent implements OnInit, OnDestroy {
  private readonly adminCasesService = inject(AdminCasesService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  // Estado
  cases: AdminCase[] = [];
  filteredCases: AdminCase[] = [];
  pageItems: AdminCase[] = [];
  total = 0;
  isLoading = false;
  hasError = false;
  errorMessage = '';

  // Paginación local
  currentPage = 1;
  pageSize = 10;

  // Búsqueda
  searchForm!: FormGroup;

  // Expansión de fila para ver "info extra"
  expandedCaseId: number | null = null;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'adminParticipants.breadcrumbAdmin', active: false },
    { label: 'adminCases.breadcrumbCases', active: true },
  ];

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

    this.loadCases();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCases(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    this.adminCasesService
      .getAllCases()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const list = Array.isArray(response?.data) ? response.data : [];
          this.cases = list;
          this.total = typeof response?.total === 'number' ? response.total : list.length;
          this.currentPage = 1;
          this.expandedCaseId = null;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          this.cases = [];
          this.filteredCases = [];
          this.pageItems = [];
          this.total = 0;
          this.hasError = true;
          this.errorMessage = error?.error?.message || error?.message || '';
          this.isLoading = false;
        },
      });
  }

  private applyFilters(): void {
    const term = (this.searchForm?.get('searchTerm')?.value ?? '').toString().trim().toLowerCase();

    if (!term) {
      this.filteredCases = [...this.cases];
    } else {
      this.filteredCases = this.cases.filter((c) => {
        const caseNumber = (c.caseNumber ?? '').toLowerCase();
        const participant = this.getParticipantFullName(c.participant).toLowerCase();
        const document = (c.participant?.documentNumber ?? '').toLowerCase();
        const professional = this.getProfessionalFullName(c.createdBy).toLowerCase();
        const reason = (c.consultationReason ?? '').toLowerCase();
        const status = (c.status ?? '').toString().toLowerCase();

        return (
          caseNumber.includes(term) ||
          participant.includes(term) ||
          document.includes(term) ||
          professional.includes(term) ||
          reason.includes(term) ||
          status.includes(term)
        );
      });
    }

    this.recalculatePage();
  }

  private recalculatePage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pageItems = this.filteredCases.slice(start, start + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.expandedCaseId = null;
    this.recalculatePage();
  }

  clearSearch(): void {
    this.searchForm.patchValue({ searchTerm: '' });
  }

  toggleExpand(c: AdminCase): void {
    this.expandedCaseId = this.expandedCaseId === c.id ? null : c.id;
  }

  isExpanded(c: AdminCase): boolean {
    return this.expandedCaseId === c.id;
  }

  getParticipantFullName(p?: AdminCaseParticipant | null): string {
    if (!p) return '';
    return [p.firstName, p.secondName, p.firstLastName, p.secondLastName]
      .filter((part) => !!part && part.toString().trim().length > 0)
      .join(' ')
      .trim();
  }

  getProfessionalFullName(u?: AdminCaseProfessional | null): string {
    if (!u) return '';
    return [u.firstName, u.secondName, u.firstLastName, u.secondLastName]
      .filter((part) => !!part && part.toString().trim().length > 0)
      .join(' ')
      .trim();
  }

  getLocation(p?: AdminCaseParticipant | null): string {
    if (!p) return '';
    return [p.city, p.state].filter((part) => !!part && part.toString().trim().length > 0).join(' / ');
  }

  /** Clase de badge según el estado del caso. */
  getStatusBadgeClass(status?: string | null): string {
    switch ((status ?? '').toLowerCase()) {
      case 'open':
        return 'badge bg-info';
      case 'in_progress':
        return 'badge bg-warning text-dark';
      case 'closed':
        return 'badge bg-success';
      default:
        return 'badge bg-light text-dark';
    }
  }

  /** Clave i18n para etiqueta del estado. */
  getStatusLabelKey(status?: string | null): string {
    switch ((status ?? '').toLowerCase()) {
      case 'open':
        return 'adminCases.status.open';
      case 'in_progress':
        return 'adminCases.status.inProgress';
      case 'closed':
        return 'adminCases.status.closed';
      default:
        return 'adminCases.status.unknown';
    }
  }

  /** Clase de badge para el estado del profesional asignado. */
  getProfessionalStatusBadgeClass(status?: string | null): string {
    switch ((status ?? '').toUpperCase()) {
      case 'ACTIVE':
        return 'badge bg-success';
      case 'INACTIVE':
        return 'badge bg-secondary';
      case 'SUSPENDED':
        return 'badge bg-warning text-dark';
      case 'BLOCKED':
        return 'badge bg-danger';
      default:
        return 'badge bg-light text-dark';
    }
  }

  trackById(_index: number, item: AdminCase): number {
    return item.id;
  }
}
