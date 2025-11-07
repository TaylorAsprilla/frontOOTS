import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { HousingTypeService } from '../housing-type.service';
import { HousingType } from '../housing-type.interface';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-housing-type-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgbPaginationModule, NgbTooltipModule],
  templateUrl: './housing-type-list.component.html',
  styleUrl: './housing-type-list.component.scss',
})
export class HousingTypeListComponent implements OnInit, OnDestroy {
  private readonly housingTypeService = inject(HousingTypeService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  housingTypes: HousingType[] = [];
  filteredHousingTypees: HousingType[] = [];
  paginatedHousingTypees: HousingType[] = [];
  isLoading = false;

  searchControl = new FormControl('');
  statusFilter: 'all' | 'active' | 'inactive' = 'all';

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  sortColumn: keyof HousingType = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.loadHousingTypees();
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

  loadHousingTypees(): void {
    this.isLoading = true;
    this.housingTypeService
      .getHousingTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.housingTypes = response.data;
          this.applyFilters();
          this.isLoading = false;
        },
        error: () => {
          this.notificationService.showError('Error al cargar los tipos de vivienda');
          this.isLoading = false;
        },
      });
  }

  applyFilters(): void {
    let filtered = [...this.housingTypes];

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

    this.filteredHousingTypees = filtered;
    this.totalItems = filtered.length;
    this.updatePaginatedHousingTypees();
  }

  updatePaginatedHousingTypees(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedHousingTypees = this.filteredHousingTypees.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedHousingTypees();
  }

  onStatusFilterChange(status: 'all' | 'active' | 'inactive'): void {
    this.statusFilter = status;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange(column: keyof HousingType): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  deleteHousingType(housingType: HousingType): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el Tipo de Vivienda "${housingType.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.housingTypeService
          .deleteHousingType(housingType.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.showSuccess('Estado civil eliminado correctamente');
              this.loadHousingTypees();
            },
            error: () => {
              this.notificationService.showError('Error al eliminar el Tipo de Vivienda');
            },
          });
      }
    });
  }
}
