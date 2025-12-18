import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule } from '@ngneat/transloco';
import { ApproachType } from '../approach-type.interface';
import { ApproachTypeService } from '../approach-type.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-approach-type-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgbPaginationModule, NgbTooltipModule, TranslocoModule],
  templateUrl: './approach-type-list.component.html',
  styleUrls: ['./approach-type-list.component.scss'],
})
export class ApproachTypeListComponent implements OnInit, OnDestroy {
  approachTypes: ApproachType[] = [];
  filteredApproachTypes: ApproachType[] = [];
  paginatedApproachTypes: ApproachType[] = [];

  // Search and filter
  searchTerm: string = '';
  searchSubject = new Subject<string>();
  filterActive: string = 'all';
  filterStatusValue: string = 'all';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  // Sorting
  sortBy: 'id' | 'name' = 'id';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Loading state
  isLoading: boolean = false;

  // Math for template
  Math = Math;

  private destroy$ = new Subject<void>();

  constructor(
    private approachTypeService: ApproachTypeService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeSearchSubscription();
    this.loadApproachTypes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeSearchSubscription(): void {
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(() => {
      this.currentPage = 1;
      this.applyFilters(this.approachTypes);
    });
  }

  loadApproachTypes(): void {
    this.isLoading = true;
    this.approachTypeService
      .getAll(true)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.approachTypes = response.data;
          this.applyFilters(this.approachTypes);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading approach types:', error);
          this.notificationService.showError('Error al cargar los tipos de enfoque');
          this.isLoading = false;
        },
      });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onFilterActiveChange(): void {
    this.filterStatusValue = this.filterActive;
    this.currentPage = 1;
    this.applyFilters(this.approachTypes);
  }

  applyFilters(data: ApproachType[]): void {
    let filtered = [...data];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          (item.description && item.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filter
    if (this.filterActive !== 'all') {
      const isActive = this.filterActive === 'active';
      filtered = filtered.filter((item) => item.isActive === isActive);
    }

    // Apply sorting
    filtered = this.sortData(filtered);

    this.filteredApproachTypes = filtered;
    this.totalItems = filtered.length;

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedApproachTypes = filtered.slice(startIndex, endIndex);
  }

  sortData(data: ApproachType[]): ApproachType[] {
    return [...data].sort((a, b) => {
      let compareValue = 0;

      if (this.sortBy === 'id') {
        compareValue = a.id - b.id;
      } else if (this.sortBy === 'name') {
        compareValue = a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
      }

      return this.sortOrder === 'asc' ? compareValue : -compareValue;
    });
  }

  onSortChange(field: 'id' | 'name'): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.applyFilters(this.approachTypes);
  }

  getSortIcon(field: 'id' | 'name'): string {
    if (this.sortBy !== field) {
      return 'fas fa-sort';
    }
    return this.sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFilters(this.approachTypes);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterActive = 'all';
    this.filterStatusValue = 'all';
    this.sortBy = 'id';
    this.sortOrder = 'asc';
    this.currentPage = 1;
    this.applyFilters(this.approachTypes);
  }

  editApproachType(id: number): void {
    this.router.navigate(['/configuration/approach-types/edit', id]);
  }

  deleteApproachType(approachType: ApproachType): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el tipo de enfoque "${approachType.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.approachTypeService
          .deactivate(approachType.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.showSuccess('Tipo de enfoque eliminado exitosamente');
              this.loadApproachTypes();
            },
            error: (error) => {
              console.error('Error deleting approach type:', error);
              this.notificationService.showError('Error al eliminar el tipo de enfoque');
            },
          });
      }
    });
  }
}
