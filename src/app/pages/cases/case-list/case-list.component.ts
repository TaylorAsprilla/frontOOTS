import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgbPaginationModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule } from '@ngneat/transloco';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

import { CaseService } from '../../../core/services/case.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { Case, CaseStatus } from '../../../core/interfaces/case.interface';

@Component({
  selector: 'app-case-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbDropdownModule,
    TranslocoModule,
    PageTitleComponent,
  ],
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.scss'],
})
export class CaseListComponent implements OnInit, OnDestroy {
  private readonly caseService = inject(CaseService);
  private readonly notificationService = inject(NotificationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  // Data and state
  cases: Case[] = [];
  filteredCases: Case[] = [];
  isLoading = false;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // Filters
  searchForm!: FormGroup;
  statusFilter: CaseStatus | 'all' = 'all';

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
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading cases:', error);
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

    this.notificationService.showDeleteConfirmation(`Caso de ${participantName}`).then((result) => {
      if (result.isConfirmed && caseItem.id) {
        this.caseService
          .deleteCase(caseItem.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadCases();
            },
            error: (error) => {
              console.error('Error deleting case:', error);
            },
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

  getParticipantName(caseItem: Case): string {
    // Assuming the case has participant data populated
    return 'Participante'; // You may need to adjust this based on your API response
  }

  clearSearch(): void {
    this.searchForm.patchValue({ searchTerm: '' });
    this.statusFilter = 'all';
    this.currentPage = 1;
    this.loadCases();
  }
}
