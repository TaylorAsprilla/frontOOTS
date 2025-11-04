import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MaritalStatusService } from '../marital-status.service';
import { MaritalStatus } from '../marital-status.interface';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-marital-status-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgbPaginationModule, NgbTooltipModule],
  templateUrl: './marital-status-list.component.html',
  styleUrl: './marital-status-list.component.scss',
})
export class MaritalStatusListComponent implements OnInit, OnDestroy {
  private readonly maritalStatusService = inject(MaritalStatusService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  maritalStatuses: MaritalStatus[] = [];
  filteredMaritalStatuses: MaritalStatus[] = [];
  paginatedMaritalStatuses: MaritalStatus[] = [];
  isLoading = false;

  searchControl = new FormControl('');
  statusFilter: 'all' | 'active' | 'inactive' = 'all';

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  sortColumn: keyof MaritalStatus = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.loadMaritalStatuses();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage = 1;
        this.applyFilters();
      });
  }

  loadMaritalStatuses(): void {
    this.isLoading = true;
    this.maritalStatusService
      .getMaritalStatuses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.maritalStatuses = response.data;
          this.applyFilters();
          this.isLoading = false;
        },
        error: () => {
          this.notificationService.showError('Error al cargar los estados civiles');
          this.isLoading = false;
        },
      });
  }

  applyFilters(): void {
    let filtered = [...this.maritalStatuses];

    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchTerm));
    }

    if (this.statusFilter !== 'all') {
      const isActive = this.statusFilter === 'active';
      filtered = filtered.filter((item) => item.isActive === isActive);
    }

    filtered.sort((a, b) => {
      const aValue = a[this.sortColumn];
      const bValue = b[this.sortColumn];
      const modifier = this.sortDirection === 'asc' ? 1 : -1;

      if (aValue < bValue) return -1 * modifier;
      if (aValue > bValue) return 1 * modifier;
      return 0;
    });

    this.filteredMaritalStatuses = filtered;
    this.totalItems = filtered.length;
    this.updatePaginatedMaritalStatuses();
  }

  updatePaginatedMaritalStatuses(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedMaritalStatuses = this.filteredMaritalStatuses.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedMaritalStatuses();
  }

  onStatusFilterChange(status: 'all' | 'active' | 'inactive'): void {
    this.statusFilter = status;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange(column: keyof MaritalStatus): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  deleteMaritalStatus(maritalStatus: MaritalStatus): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el estado civil "${maritalStatus.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.maritalStatusService
          .deleteMaritalStatus(maritalStatus.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.showSuccess('Estado civil eliminado correctamente');
              this.loadMaritalStatuses();
            },
            error: () => {
              this.notificationService.showError('Error al eliminar el estado civil');
            },
          });
      }
    });
  }
}
