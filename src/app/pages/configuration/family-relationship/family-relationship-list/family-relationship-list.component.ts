import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FamilyRelationshipService } from '../family-relationship.service';
import { FamilyRelationship } from '../family-relationship.interface';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-family-relationship-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgbPaginationModule, NgbTooltipModule],
  templateUrl: './family-relationship-list.component.html',
  styleUrl: './family-relationship-list.component.scss',
})
export class FamilyRelationshipListComponent implements OnInit, OnDestroy {
  private readonly familyRelationshipService = inject(FamilyRelationshipService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  familyRelationships: FamilyRelationship[] = [];
  filteredFamilyRelationshipes: FamilyRelationship[] = [];
  paginatedFamilyRelationshipes: FamilyRelationship[] = [];
  isLoading = false;

  searchControl = new FormControl('');
  statusFilter: 'all' | 'active' | 'inactive' = 'all';

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  sortColumn: keyof FamilyRelationship = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.loadFamilyRelationshipes();
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

  loadFamilyRelationshipes(): void {
    this.isLoading = true;
    this.familyRelationshipService
      .getFamilyRelationships()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.familyRelationships = response.data;
          this.applyFilters();
          this.isLoading = false;
        },
        error: () => {
          this.notificationService.showError('Error al cargar los parentescos');
          this.isLoading = false;
        },
      });
  }

  applyFilters(): void {
    let filtered = [...this.familyRelationships];

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

    this.filteredFamilyRelationshipes = filtered;
    this.totalItems = filtered.length;
    this.updatePaginatedFamilyRelationshipes();
  }

  updatePaginatedFamilyRelationshipes(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedFamilyRelationshipes = this.filteredFamilyRelationshipes.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedFamilyRelationshipes();
  }

  onStatusFilterChange(status: 'all' | 'active' | 'inactive'): void {
    this.statusFilter = status;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange(column: keyof FamilyRelationship): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  deleteFamilyRelationship(familyRelationship: FamilyRelationship): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el Parentesco "${familyRelationship.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.familyRelationshipService
          .deleteFamilyRelationship(familyRelationship.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.showSuccess('Estado civil eliminado correctamente');
              this.loadFamilyRelationshipes();
            },
            error: () => {
              this.notificationService.showError('Error al eliminar el Parentesco');
            },
          });
      }
    });
  }
}
