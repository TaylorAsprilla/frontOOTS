import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { GenderService } from '../gender.service';
import { Gender } from '../gender.interface';
import { NotificationService } from '../../../../core/services/notification.service';
import { PageTitleComponent } from '../../../../shared/page-title/page-title.component';

@Component({
  selector: 'app-gender-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgbPaginationModule, NgbTooltipModule, PageTitleComponent],
  templateUrl: './gender-list.component.html',
  styleUrl: './gender-list.component.scss',
})
export class GenderListComponent implements OnInit, OnDestroy {
  private readonly genderService = inject(GenderService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  genders: Gender[] = [];
  filteredGenders: Gender[] = [];
  paginatedGenders: Gender[] = [];

  // Paginación
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // Búsqueda y filtros
  searchControl = new FormControl('');
  statusFilter = new FormControl('all');

  // Ordenamiento
  sortBy: keyof Gender = 'id';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Loading state
  isLoading = false;

  // Breadcrumbs
  breadcrumbItems = [
    { label: 'Configuración', link: '/configuration' },
    { label: 'Géneros', active: true },
  ];

  Math = Math;

  ngOnInit(): void {
    this.loadGenders();
    this.setupSearchListener();
    this.setupStatusFilterListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchListener(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage = 1;
        this.applyFilters();
      });
  }

  private setupStatusFilterListener(): void {
    this.statusFilter.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });
  }

  loadGenders(): void {
    this.isLoading = true;
    this.genderService
      .getGenders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.genders = response.data;
            this.applyFilters();
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading genders:', error);
          this.notificationService.showError('Error al cargar los géneros');
          this.isLoading = false;
        },
      });
  }

  applyFilters(): void {
    let filtered = [...this.genders];

    // Filtro de búsqueda
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter((gender) => gender.name.toLowerCase().includes(searchTerm));
    }

    // Filtro de estado
    const status = this.statusFilter.value;
    if (status === 'active') {
      filtered = filtered.filter((gender) => gender.isActive);
    } else if (status === 'inactive') {
      filtered = filtered.filter((gender) => !gender.isActive);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      const aValue = a[this.sortBy];
      const bValue = b[this.sortBy];

      if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredGenders = filtered;
    this.totalItems = filtered.length;
    this.updatePaginatedGenders();
  }

  updatePaginatedGenders(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedGenders = this.filteredGenders.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedGenders();
  }

  onSortChange(column: keyof Gender): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
    this.applyFilters();
  }

  getSortIcon(column: keyof Gender): string {
    if (this.sortBy !== column) return 'fa-sort';
    return this.sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  createGender(): void {
    this.router.navigate(['/configuration/genders/create']);
  }

  editGender(id: number): void {
    this.router.navigate([`/configuration/genders/edit/${id}`]);
  }

  deleteGender(id: number, name: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el género "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.genderService
          .deleteGender(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.showSuccess('Género eliminado exitosamente');
              this.loadGenders();
            },
            error: (error) => {
              console.error('Error deleting gender:', error);
              this.notificationService.showError('Error al eliminar el género');
            },
          });
      }
    });
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.statusFilter.setValue('all');
    this.currentPage = 1;
  }
}
