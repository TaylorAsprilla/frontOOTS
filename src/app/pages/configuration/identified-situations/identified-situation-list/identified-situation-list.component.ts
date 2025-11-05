import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {
  IdentifiedSituationService,
  IdentifiedSituation,
} from '../../../../core/services/identified-situation.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PageTitleComponent } from '../../../../shared/page-title/page-title.component';

@Component({
  selector: 'app-identified-situation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgbPaginationModule, NgbTooltipModule, PageTitleComponent],
  templateUrl: './identified-situation-list.component.html',
  styleUrl: './identified-situation-list.component.scss',
})
export class IdentifiedSituationListComponent implements OnInit, OnDestroy {
  private readonly identifiedSituationService = inject(IdentifiedSituationService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  situations: IdentifiedSituation[] = [];
  filteredSituations: IdentifiedSituation[] = [];
  paginatedSituations: IdentifiedSituation[] = [];

  // Paginación
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // Búsqueda y filtros
  searchControl = new FormControl('');
  statusFilter = new FormControl('all');

  // Ordenamiento
  sortBy: keyof IdentifiedSituation = 'id';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Loading state
  isLoading = false;

  // Breadcrumbs
  breadcrumbItems = [
    { label: 'Configuración', link: '/configuration' },
    { label: 'Situaciones Identificadas', active: true },
  ];

  Math = Math;

  ngOnInit(): void {
    this.loadSituations();
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

  loadSituations(): void {
    this.isLoading = true;
    this.identifiedSituationService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (situations) => {
          this.situations = situations;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading identified situations:', error);
          this.notificationService.showError('Error al cargar las situaciones identificadas');
          this.isLoading = false;
        },
      });
  }

  applyFilters(): void {
    let filtered = [...this.situations];

    // Filtro de búsqueda
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter((situation) => situation.name.toLowerCase().includes(searchTerm));
    }

    // Filtro de estado
    const status = this.statusFilter.value;
    if (status === 'active') {
      filtered = filtered.filter((situation) => situation.isActive);
    } else if (status === 'inactive') {
      filtered = filtered.filter((situation) => !situation.isActive);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      const aValue = a[this.sortBy];
      const bValue = b[this.sortBy];

      if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredSituations = filtered;
    this.totalItems = filtered.length;
    this.updatePaginatedSituations();
  }

  updatePaginatedSituations(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedSituations = this.filteredSituations.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedSituations();
  }

  onSortChange(column: keyof IdentifiedSituation): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
    this.applyFilters();
  }

  getSortIcon(column: keyof IdentifiedSituation): string {
    if (this.sortBy !== column) return 'fa-sort';
    return this.sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  createSituation(): void {
    this.router.navigate(['/configuration/identified-situations/create']);
  }

  editSituation(id: number): void {
    this.router.navigate([`/configuration/identified-situations/edit/${id}`]);
  }

  deleteSituation(id: number, name: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la situación "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.identifiedSituationService
          .delete(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.showSuccess('Situación eliminada exitosamente');
              this.loadSituations();
            },
            error: (error) => {
              console.error('Error deleting identified situation:', error);
              this.notificationService.showError('Error al eliminar la situación');
            },
          });
      }
    });
  }

  toggleStatus(id: number, currentStatus: boolean): void {
    const newStatus = !currentStatus;
    const action = newStatus ? 'activar' : 'desactivar';

    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas ${action} esta situación?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.identifiedSituationService
          .toggleStatus(id, newStatus)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.showSuccess(`Situación ${newStatus ? 'activada' : 'desactivada'} exitosamente`);
              this.loadSituations();
            },
            error: (error) => {
              console.error('Error toggling status:', error);
              this.notificationService.showError('Error al cambiar el estado de la situación');
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
