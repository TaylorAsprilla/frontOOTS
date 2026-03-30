import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgbPaginationModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

import { CaseService } from '../../../core/services/case.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { CaseStatus } from '../../../core/interfaces/case.interface';
import { LocalizedDatePipe } from '../../../core/pipes/localized-date.pipe';

@Component({
  selector: 'app-case-list',
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
    LocalizedDatePipe,
  ],
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.scss'],
})
export class CaseListComponent implements OnInit, OnDestroy {
  private readonly caseService = inject(CaseService);
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly notificationService = inject(NotificationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly translocoService = inject(TranslocoService);
  private readonly destroy$ = new Subject<void>();

  // Data and state
  cases: any[] = [];
  filteredCases: any[] = [];
  private allCasesFromApi: any[] = [];
  isLoading = false;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // Filters
  searchForm!: FormGroup;
  statusFilter: CaseStatus | 'all' = 'all';

  // Sorting
  sortColumn: 'id' | 'participantName' | 'status' | 'createdAt' | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  // Breadcrumb
  breadcrumbItems: BreadcrumbItem[] = [{ label: 'cases.title', active: true }];

  // Status options
  statusOptions: Array<{ value: CaseStatus | 'all'; label: string }> = [
    { value: 'all', label: 'cases.allStatuses' },
    { value: CaseStatus.OPEN, label: 'cases.open' },
    { value: CaseStatus.ACTIVE, label: 'cases.active' },
    { value: CaseStatus.IN_PROGRESS, label: 'cases.inProgress' },
    { value: CaseStatus.CLOSED, label: 'cases.closed' },
    { value: CaseStatus.TRANSFERRED, label: 'cases.transferred' },
    { value: CaseStatus.SUSPENDED, label: 'cases.suspended' },
  ];

  // Math utility for templates
  Math = Math;

  ngOnInit(): void {
    this.initializeSearchForm();
    this.setupSearchSubscription();
    this.loadCases();
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
        this.applyFiltersAndPagination();
      });
  }

  loadCases(): void {
    this.isLoading = true;

    const userId = this.tokenStorageService.getUser()?.id;
    if (!userId) {
      this.isLoading = false;
      this.notificationService.showError('No se pudo identificar al usuario en sesión');
      return;
    }

    this.caseService
      .getCasesByUserId(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.allCasesFromApi = response.cases;
          this.isLoading = false;
          this.applyFiltersAndPagination();
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  private applyFiltersAndPagination(): void {
    let filtered = [...this.allCasesFromApi];

    const searchTerm = (this.searchForm.get('searchTerm')?.value ?? '').toLowerCase().trim();
    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.participant?.fullName?.toLowerCase().includes(searchTerm) ||
          c.caseNumber?.toLowerCase().includes(searchTerm) ||
          c.consultationReason?.toLowerCase().includes(searchTerm),
      );
    }

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === this.statusFilter);
    }

    this.totalItems = filtered.length;

    if (this.sortColumn) {
      this.applySortingOn(filtered);
    }

    const start = (this.currentPage - 1) * this.pageSize;
    this.filteredCases = filtered.slice(start, start + this.pageSize);
    this.cases = this.filteredCases;
  }

  onStatusFilterChange(status: CaseStatus | 'all'): void {
    this.statusFilter = status;
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFiltersAndPagination();
  }

  deleteCase(caseItem: any): void {
    if (!caseItem.id) return;

    const participantName = this.getParticipantName(caseItem);
    const deleteMessage = `${this.translocoService.translate('cases.deleteConfirmation')} ${participantName}`;

    this.notificationService.showDeleteConfirmation(deleteMessage).then((result) => {
      if (result.isConfirmed && caseItem.id) {
        this.caseService
          .deleteCase(caseItem.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadCases();
            },
            error: (error) => {},
          });
      }
    });
  }

  getStatusBadgeClass(status?: CaseStatus): string {
    switch (status) {
      case CaseStatus.ACTIVE:
        return 'badge bg-success';
      case CaseStatus.IN_PROGRESS:
        return 'badge bg-primary';
      case CaseStatus.CLOSED:
        return 'badge bg-secondary';
      case CaseStatus.TRANSFERRED:
        return 'badge bg-info';
      case CaseStatus.SUSPENDED:
        return 'badge bg-warning';
      default:
        return 'badge bg-light text-dark';
    }
  }

  getStatusLabel(status: CaseStatus | 'all'): string {
    const option = this.statusOptions.find((s) => s.value === status);
    return option?.label || 'cases.unknown';
  }

  getParticipantName(caseItem: any): string {
    if (caseItem?.participant?.fullName) {
      return caseItem.participant.fullName;
    }
    return this.translocoService.translate('cases.loadingParticipant');
  }

  clearSearch(): void {
    this.searchForm.patchValue({ searchTerm: '' });
    this.statusFilter = 'all';
    this.currentPage = 1;
    this.loadCases();
  }

  /**
   * Sort cases by column
   */
  sortBy(column: 'id' | 'participantName' | 'status' | 'createdAt'): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.applyFiltersAndPagination();
  }

  /**
   * Apply sorting to a given array in-place
   */
  private applySortingOn(list: any[]): void {
    if (!this.sortColumn) {
      return;
    }

    list.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (this.sortColumn) {
        case 'id':
          valueA = a.id || 0;
          valueB = b.id || 0;
          break;
        case 'participantName':
          valueA = (a.participant?.fullName || '').toLowerCase();
          valueB = (b.participant?.fullName || '').toLowerCase();
          break;
        case 'status':
          valueA = a.status || '';
          valueB = b.status || '';
          break;
        case 'createdAt':
          valueA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          valueB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          break;
        default:
          return 0;
      }

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  /**
   * Get sort icon for column
   */
  getSortIcon(column: 'id' | 'participantName' | 'status' | 'createdAt'): string {
    if (this.sortColumn !== column) {
      return 'mdi mdi-sort';
    }
    return this.sortDirection === 'asc' ? 'mdi mdi-sort-ascending' : 'mdi mdi-sort-descending';
  }
}
