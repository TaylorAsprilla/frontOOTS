import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgbPaginationModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';

import { CaseService } from '../../../core/services/case.service';
import { ParticipantService } from '../../../core/services/participant.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { Case, CaseStatus } from '../../../core/interfaces/case.interface';
import { Participant } from '../../../core/interfaces/participant-create.interface';

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
  ],
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.scss'],
})
export class CaseListComponent implements OnInit, OnDestroy {
  private readonly caseService = inject(CaseService);
  private readonly participantService = inject(ParticipantService);
  private readonly notificationService = inject(NotificationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly translocoService = inject(TranslocoService);
  private readonly destroy$ = new Subject<void>();

  // Data and state
  cases: Case[] = [];
  filteredCases: Case[] = [];
  participantsMap: Map<number, Participant> = new Map();
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
        this.loadCases();
      });
  }

  loadCases(): void {
    this.isLoading = true;

    const filters = {
      page: this.currentPage,
      limit: this.pageSize,
      status: this.statusFilter !== 'all' ? this.statusFilter : undefined,
    };

    this.caseService
      .getCases(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.cases = response.data;
          this.filteredCases = response.data;
          this.totalItems = response.pagination?.total || 0;
          this.loadParticipantsForCases(response.data);
          // Apply sorting after loading data
          if (this.sortColumn) {
            this.applySorting();
          }
        },
        error: (error) => {
          this.isLoading = false;
        },
      });
  }

  onStatusFilterChange(status: CaseStatus | 'all'): void {
    this.statusFilter = status;
    this.currentPage = 1;
    this.loadCases();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCases();
  }

  deleteCase(caseItem: Case): void {
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

  /**
   * Load participants data for all cases
   */
  private loadParticipantsForCases(cases: Case[]): void {
    const uniqueParticipantIds = [...new Set(cases.map((c) => c.participantId).filter((id) => id))];

    if (uniqueParticipantIds.length === 0) {
      this.isLoading = false;
      return;
    }

    const participantRequests = uniqueParticipantIds.map((id) =>
      this.participantService.getParticipantById(id).pipe(takeUntil(this.destroy$)),
    );

    forkJoin(participantRequests).subscribe({
      next: (responses) => {
        responses.forEach((response) => {
          if (response.data) {
            this.participantsMap.set(response.data.id!, response.data);
          }
        });
        this.isLoading = false;
        // Re-apply sorting after participants are loaded (for name sorting)
        if (this.sortColumn === 'participantName') {
          this.applySorting();
        }
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }

  getParticipantName(caseItem: Case): string {
    const participant = this.participantsMap.get(caseItem.participantId);
    if (participant) {
      return `${participant.firstName} ${participant.firstLastName}`;
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
      // Toggle direction if same column
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // New column, default to ascending
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.applySorting();
  }

  /**
   * Apply sorting to filtered cases
   */
  private applySorting(): void {
    if (!this.sortColumn) {
      return;
    }

    this.filteredCases.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (this.sortColumn) {
        case 'id':
          valueA = a.id || 0;
          valueB = b.id || 0;
          break;
        case 'participantName':
          valueA = this.getParticipantName(a).toLowerCase();
          valueB = this.getParticipantName(b).toLowerCase();
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
