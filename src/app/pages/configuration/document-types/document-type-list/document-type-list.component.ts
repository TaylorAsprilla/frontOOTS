import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule } from '@ngneat/transloco';
import { DocumentType } from '../document-type.interface';
import { DocumentTypeService } from '../document-type.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-document-type-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgbPaginationModule, NgbTooltipModule, TranslocoModule],
  templateUrl: './document-type-list.component.html',
  styleUrls: ['./document-type-list.component.scss'],
})
export class DocumentTypeListComponent implements OnInit, OnDestroy {
  documentTypes: DocumentType[] = [];
  filteredDocumentTypes: DocumentType[] = [];
  paginatedDocumentTypes: DocumentType[] = [];

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
    private documentTypeService: DocumentTypeService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeSearchSubscription();
    this.loadDocumentTypes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeSearchSubscription(): void {
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(() => {
      this.currentPage = 1;
      this.applyFilters(this.documentTypes);
    });
  }

  loadDocumentTypes(): void {
    this.isLoading = true;
    this.documentTypeService
      .getDocumentTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.documentTypes = response.data;
            this.applyFilters(this.documentTypes);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading document types:', error);
          this.notificationService.showError('Error al cargar los tipos de documento');
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
    this.applyFilters(this.documentTypes);
  }

  applyFilters(data: DocumentType[]): void {
    let filtered = [...data];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchLower));
    }

    // Apply status filter
    if (this.filterActive !== 'all') {
      const isActive = this.filterActive === 'active';
      filtered = filtered.filter((item) => item.isActive === isActive);
    }

    // Apply sorting
    filtered = this.sortData(filtered);

    this.filteredDocumentTypes = filtered;
    this.totalItems = filtered.length;

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedDocumentTypes = filtered.slice(startIndex, endIndex);
  }

  sortData(data: DocumentType[]): DocumentType[] {
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
    this.applyFilters(this.documentTypes);
  }

  getSortIcon(field: 'id' | 'name'): string {
    if (this.sortBy !== field) {
      return 'fas fa-sort';
    }
    return this.sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFilters(this.documentTypes);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterActive = 'all';
    this.filterStatusValue = 'all';
    this.sortBy = 'id';
    this.sortOrder = 'asc';
    this.currentPage = 1;
    this.applyFilters(this.documentTypes);
  }

  editDocumentType(id: number): void {
    this.router.navigate(['/configuration/document-types/edit', id]);
  }

  deleteDocumentType(documentType: DocumentType): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el tipo de documento "${documentType.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.documentTypeService
          .deleteDocumentType(documentType.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.showSuccess('Tipo de documento eliminado exitosamente');
              this.loadDocumentTypes();
            },
            error: (error) => {
              console.error('Error deleting document type:', error);
              this.notificationService.showError('Error al eliminar el tipo de documento');
            },
          });
      }
    });
  }
}
