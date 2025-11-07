import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { HealthInsuranceService } from '../health-insurance.service';
import { HealthInsurance } from '../health-insurance.interface';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-health-insurance-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgbPaginationModule, NgbTooltipModule],
  templateUrl: './health-insurance-list.component.html',
  styleUrl: './health-insurance-list.component.scss',
})
export class HealthInsuranceListComponent implements OnInit, OnDestroy {
  private readonly healthInsuranceService = inject(HealthInsuranceService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  healthInsurances: HealthInsurance[] = [];
  filteredHealthInsurancees: HealthInsurance[] = [];
  paginatedHealthInsurancees: HealthInsurance[] = [];
  isLoading = false;

  searchControl = new FormControl('');
  statusFilter: 'all' | 'active' | 'inactive' = 'all';

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  sortColumn: keyof HealthInsurance = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.loadHealthInsurancees();
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

  loadHealthInsurancees(): void {
    this.isLoading = true;
    this.healthInsuranceService
      .getHealthInsurances()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.healthInsurances = response.data;
          this.applyFilters();
          this.isLoading = false;
        },
        error: () => {
          this.notificationService.showError('Error al cargar los eps');
          this.isLoading = false;
        },
      });
  }

  applyFilters(): void {
    let filtered = [...this.healthInsurances];

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

    this.filteredHealthInsurancees = filtered;
    this.totalItems = filtered.length;
    this.updatePaginatedHealthInsurancees();
  }

  updatePaginatedHealthInsurancees(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedHealthInsurancees = this.filteredHealthInsurancees.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedHealthInsurancees();
  }

  onStatusFilterChange(status: 'all' | 'active' | 'inactive'): void {
    this.statusFilter = status;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange(column: keyof HealthInsurance): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  deleteHealthInsurance(healthInsurance: HealthInsurance): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el EPS "${healthInsurance.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.healthInsuranceService
          .deleteHealthInsurance(healthInsurance.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.showSuccess('Estado civil eliminado correctamente');
              this.loadHealthInsurancees();
            },
            error: () => {
              this.notificationService.showError('Error al eliminar el EPS');
            },
          });
      }
    });
  }
}
