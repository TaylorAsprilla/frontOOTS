import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { IncomeLevelService } from '../income-level.service';
import { IncomeLevel } from '../income-level.interface';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-income-level-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgbPaginationModule, NgbTooltipModule],
  templateUrl: './income-level-list.component.html',
  styleUrl: './income-level-list.component.scss',
})
export class IncomeLevelListComponent implements OnInit, OnDestroy {
  private readonly incomeLevelService = inject(IncomeLevelService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  incomeLevels: IncomeLevel[] = [];
  filteredIncomeLeveles: IncomeLevel[] = [];
  paginatedIncomeLeveles: IncomeLevel[] = [];
  isLoading = false;

  searchControl = new FormControl('');
  statusFilter: 'all' | 'active' | 'inactive' = 'all';

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  sortColumn: keyof IncomeLevel = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.loadIncomeLeveles();
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

  loadIncomeLeveles(): void {
    this.isLoading = true;
    this.incomeLevelService
      .getIncomeLevels()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.incomeLevels = response.data;
          this.applyFilters();
          this.isLoading = false;
        },
        error: () => {
          this.notificationService.showError('Error al cargar los niveles de ingresos');
          this.isLoading = false;
        },
      });
  }

  applyFilters(): void {
    let filtered = [...this.incomeLevels];

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

    this.filteredIncomeLeveles = filtered;
    this.totalItems = filtered.length;
    this.updatePaginatedIncomeLeveles();
  }

  updatePaginatedIncomeLeveles(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedIncomeLeveles = this.filteredIncomeLeveles.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedIncomeLeveles();
  }

  onStatusFilterChange(status: 'all' | 'active' | 'inactive'): void {
    this.statusFilter = status;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange(column: keyof IncomeLevel): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  deleteIncomeLevel(incomeLevel: IncomeLevel): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el Nivel de Ingresos "${incomeLevel.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.incomeLevelService
          .deleteIncomeLevel(incomeLevel.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.showSuccess('Estado civil eliminado correctamente');
              this.loadIncomeLeveles();
            },
            error: () => {
              this.notificationService.showError('Error al eliminar el Nivel de Ingresos');
            },
          });
      }
    });
  }
}
