import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslocoModule } from '@ngneat/transloco';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AcademicLevelService } from '../../../../core/services/academic-level.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AcademicLevel } from '../../../../core/interfaces/academic-level.interface';
import { PageTitleComponent } from '../../../../shared/page-title/page-title.component';
import { BreadcrumbItem } from '../../../../shared/page-title/page-title.model';

@Component({
  selector: 'app-academic-level-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule, NgbPaginationModule, NgbTooltipModule, PageTitleComponent],
  templateUrl: './academic-level-list.component.html',
  styleUrls: ['./academic-level-list.component.scss'],
})
export class AcademicLevelListComponent implements OnInit, OnDestroy {
  private readonly academicLevelService = inject(AcademicLevelService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Data
  academicLevels: AcademicLevel[] = [];
  isLoading = false;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  // Search and filters
  searchTerm = '';
  filterActive: boolean | undefined = undefined;
  filterStatusValue = 'all'; // Valor para el select
  sortBy: 'id' | 'name' = 'id'; // Campo de ordenamiento
  sortOrder: 'asc' | 'desc' = 'asc'; // Dirección de ordenamiento

  // Breadcrumb
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'configuration.title', active: false },
    { label: 'academicLevel.title', active: true },
  ];

  ngOnInit(): void {
    this.loadAcademicLevels();
    this.setupSearchSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Cargar niveles académicos
   */
  loadAcademicLevels(): void {
    this.isLoading = true;

    this.academicLevelService
      .getAcademicLevels()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.statusCode === 200 && response.data) {
            // Aplicar filtros localmente
            this.applyFilters(response.data);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error loading academic levels:', error);
          this.notificationService.showError('academicLevel.loadError');
        },
      });
  }

  /**
   * Aplicar filtros y búsqueda localmente
   */
  private applyFilters(data: AcademicLevel[]): void {
    let filteredData = [...data];

    // Filtrar por búsqueda
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filteredData = filteredData.filter((level) => level.name.toLowerCase().includes(searchLower));
    }

    // Filtrar por estado
    if (this.filterActive !== undefined) {
      filteredData = filteredData.filter((level) => level.isActive === this.filterActive);
    }

    // Ordenar datos
    filteredData = this.sortData(filteredData);

    // Calcular paginación
    this.totalItems = filteredData.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);

    // Aplicar paginación
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.academicLevels = filteredData.slice(startIndex, endIndex);
  }

  /**
   * Ordenar datos según el campo y dirección seleccionados
   */
  private sortData(data: AcademicLevel[]): AcademicLevel[] {
    return data.sort((a, b) => {
      let comparison = 0;

      if (this.sortBy === 'id') {
        comparison = a.id - b.id;
      } else if (this.sortBy === 'name') {
        comparison = a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  /**
   * Cambiar ordenamiento
   */
  onSortChange(field: 'id' | 'name'): void {
    if (this.sortBy === field) {
      // Si es el mismo campo, cambiar dirección
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Si es un campo diferente, establecer ascendente
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.loadAcademicLevels();
  }

  /**
   * Configurar suscripción para búsqueda con debounce
   */
  private setupSearchSubscription(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.searchTerm = searchTerm;
        this.currentPage = 1;
        // Recargar para aplicar filtros
        this.loadAcademicLevels();
      });
  }

  /**
   * Manejar cambio en el input de búsqueda
   */
  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  /**
   * Cambiar página
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAcademicLevels();
  }

  /**
   * Cambiar filtro de estado activo
   */
  onFilterActiveChange(value: string): void {
    this.filterStatusValue = value;
    if (value === 'all') {
      this.filterActive = undefined;
    } else {
      this.filterActive = value === 'true';
    }
    this.currentPage = 1;
    this.loadAcademicLevels();
  }

  /**
   * Navegar a crear nuevo nivel académico
   */
  createAcademicLevel(): void {
    this.router.navigate(['/configuration/academic-level/create']);
  }

  /**
   * Navegar a editar nivel académico
   */
  editAcademicLevel(id: number): void {
    this.router.navigate(['/configuration/academic-level/edit', id]);
  }

  /**
   * Eliminar nivel académico con confirmación
   */
  deleteAcademicLevel(academicLevel: AcademicLevel): void {
    this.notificationService
      .showConfirmation('academicLevel.confirmDelete', {
        confirmButtonText: 'academicLevel.delete',
        text: `${academicLevel.name}`,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.isLoading = true;
          this.academicLevelService
            .deleteAcademicLevel(academicLevel.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                this.isLoading = false;
                if (response.statusCode === 200) {
                  this.notificationService.showSuccess('academicLevel.deleteSuccess');
                  this.loadAcademicLevels();
                }
              },
              error: (error) => {
                this.isLoading = false;
                console.error('Error deleting academic level:', error);
                this.notificationService.showError('academicLevel.deleteError');
              },
            });
        }
      });
  }

  /**
   * Cambiar estado activo/inactivo
   */
  toggleActiveStatus(academicLevel: AcademicLevel): void {
    const newStatus = !academicLevel.isActive;
    const confirmMessage = newStatus ? 'academicLevel.confirmActivate' : 'academicLevel.confirmDeactivate';

    this.notificationService.showConfirmation(confirmMessage, { text: academicLevel.name }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.academicLevelService
          .updateAcademicLevel(academicLevel.id, { name: academicLevel.name, isActive: newStatus })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.isLoading = false;
              if (response.statusCode === 200) {
                this.notificationService.showSuccess(
                  newStatus ? 'academicLevel.activateSuccess' : 'academicLevel.deactivateSuccess'
                );
                this.loadAcademicLevels();
              }
            },
            error: (error) => {
              this.isLoading = false;
              console.error('Error toggling active status:', error);
              this.notificationService.showError('academicLevel.updateError');
            },
          });
      }
    });
  }

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    this.searchTerm = '';
    this.filterActive = undefined;
    this.filterStatusValue = 'all';
    this.sortBy = 'id';
    this.sortOrder = 'asc';
    this.currentPage = 1;
    this.loadAcademicLevels();
  }

  /**
   * Obtener icono de ordenamiento para una columna
   */
  getSortIcon(field: 'id' | 'name'): string {
    if (this.sortBy !== field) {
      return 'fas fa-sort';
    }
    return this.sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }
}
