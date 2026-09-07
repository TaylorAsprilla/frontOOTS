import { Component, OnDestroy, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup } from '@angular/forms';
import {
  NgbPaginationModule,
  NgbTooltipModule,
  NgbModal,
  NgbModalModule,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule } from '@ngneat/transloco';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

import { AdminCasesService } from '../../../core/services/admin-cases.service';
import { AdminCase, AdminCaseParticipant, AdminCaseProfessional } from '../../../core/interfaces/admin-case.interface';
import { CaseService } from '../../../core/services/case.service';
import { CaseTransfer } from '../../../core/interfaces/case.interface';
import { UserService } from '../../../core/services/user.service';
import { UserModel } from '../../../core/models/user.model';
import { NotificationService } from '../../../core/services/notification.service';
import { RoleService } from '../../../core/services/role.service';
import { CountryService } from '../../../core/services/country.service';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { LocalizedDatePipe } from '../../../core/pipes/localized-date.pipe';

@Component({
  selector: 'app-admin-cases-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgbModalModule,
    TranslocoModule,
    PageTitleComponent,
    LocalizedDatePipe,
  ],
  templateUrl: './admin-cases-list.component.html',
  styleUrls: ['./admin-cases-list.component.scss'],
})
export class AdminCasesListComponent implements OnInit, OnDestroy {
  private readonly adminCasesService = inject(AdminCasesService);
  private readonly caseService = inject(CaseService);
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);
  private readonly roleService = inject(RoleService);
  private readonly countryService = inject(CountryService);
  private readonly modalService = inject(NgbModal);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  // Estado
  cases: AdminCase[] = [];
  filteredCases: AdminCase[] = [];
  pageItems: AdminCase[] = [];
  total = 0;
  isLoading = false;
  hasError = false;
  errorMessage = '';

  // Paginación local
  currentPage = 1;
  pageSize = 10;

  // Búsqueda
  searchForm!: FormGroup;

  // Expansión de fila para ver "info extra"
  expandedCaseId: number | null = null;

  // Transferencia de casos
  @ViewChild('transferModal') transferModal!: TemplateRef<unknown>;
  private transferModalRef: NgbModalRef | null = null;
  transferTargetCase: AdminCase | null = null;
  professionals: UserModel[] = [];
  transferToProfessionalId: number | null = null;
  transferReason = '';
  isTransferring = false;
  isLoadingProfessionals = false;
  transferHistory: CaseTransfer[] = [];
  isLoadingTransferHistory = false;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'adminParticipants.breadcrumbAdmin', active: false },
    { label: 'adminCases.breadcrumbCases', active: true },
  ];

  Math = Math;

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({ searchTerm: [''] });

    this.searchForm
      .get('searchTerm')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage = 1;
        this.applyFilters();
      });

    this.loadCases();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCases(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    this.adminCasesService
      .getAllCases()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const list = Array.isArray(response?.data) ? response.data : [];
          this.cases = list;
          this.total = typeof response?.total === 'number' ? response.total : list.length;
          this.currentPage = 1;
          this.expandedCaseId = null;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          this.cases = [];
          this.filteredCases = [];
          this.pageItems = [];
          this.total = 0;
          this.hasError = true;
          this.errorMessage = error?.error?.message || error?.message || '';
          this.isLoading = false;
        },
      });
  }

  private applyFilters(): void {
    const term = (this.searchForm?.get('searchTerm')?.value ?? '').toString().trim().toLowerCase();

    if (!term) {
      this.filteredCases = [...this.cases];
    } else {
      this.filteredCases = this.cases.filter((c) => {
        const caseNumber = (c.caseNumber ?? '').toLowerCase();
        const participant = this.getParticipantFullName(c.participant).toLowerCase();
        const document = (c.participant?.documentNumber ?? '').toLowerCase();
        const professional = this.getProfessionalFullName(c.createdBy).toLowerCase();
        const reason = (c.consultationReason ?? '').toLowerCase();
        const status = (c.status ?? '').toString().toLowerCase();

        return (
          caseNumber.includes(term) ||
          participant.includes(term) ||
          document.includes(term) ||
          professional.includes(term) ||
          reason.includes(term) ||
          status.includes(term)
        );
      });
    }

    this.recalculatePage();
  }

  private recalculatePage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pageItems = this.filteredCases.slice(start, start + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.expandedCaseId = null;
    this.recalculatePage();
  }

  clearSearch(): void {
    this.searchForm.patchValue({ searchTerm: '' });
  }

  toggleExpand(c: AdminCase): void {
    this.expandedCaseId = this.expandedCaseId === c.id ? null : c.id;
  }

  isExpanded(c: AdminCase): boolean {
    return this.expandedCaseId === c.id;
  }

  getParticipantFullName(p?: AdminCaseParticipant | null): string {
    if (!p) return '';
    return [p.firstName, p.secondName, p.firstLastName, p.secondLastName]
      .filter((part) => !!part && part.toString().trim().length > 0)
      .join(' ')
      .trim();
  }

  getProfessionalFullName(u?: AdminCaseProfessional | null): string {
    if (!u) return '';
    return [u.firstName, u.secondName, u.firstLastName, u.secondLastName]
      .filter((part) => !!part && part.toString().trim().length > 0)
      .join(' ')
      .trim();
  }

  getLocation(p?: AdminCaseParticipant | null): string {
    if (!p) return '';
    return [p.city, p.state].filter((part) => !!part && part.toString().trim().length > 0).join(' / ');
  }

  /** URL de la bandera del país del participante (o null si no se puede determinar). */
  getCountryFlag(p?: AdminCaseParticipant | null): string | null {
    if (!p) return null;
    if (p.country?.flagUrl) return p.country.flagUrl;
    if (p.countryId) {
      const config = this.countryService.getAvailableCountries().find((c) => c.id === p.countryId);
      if (config?.flag) return config.flag;
    }
    return null;
  }

  /** Nombre del país del participante (para el tooltip de la bandera). */
  getCountryName(p?: AdminCaseParticipant | null): string {
    if (!p) return '';
    if (p.country?.name) return p.country.name;
    if (p.countryId) {
      const config = this.countryService.getAvailableCountries().find((c) => c.id === p.countryId);
      if (config?.name) return config.name;
    }
    return '';
  }

  /** Cantidad de notas de progreso registradas en el caso. */
  getProgressNotesCount(caseItem: AdminCase): number {
    if (typeof caseItem.progressNotesCount === 'number') return caseItem.progressNotesCount;
    if (Array.isArray(caseItem.progressNotes)) return caseItem.progressNotes.length;
    return 0;
  }

  /** Días transcurridos desde la apertura del caso (hasta el cierre, o hasta hoy si sigue abierto). */
  getDaysOpen(caseItem: AdminCase): number | null {
    if (!caseItem.createdAt) return null;
    const start = new Date(caseItem.createdAt).getTime();
    const end = caseItem.closedAt ? new Date(caseItem.closedAt).getTime() : Date.now();
    if (Number.isNaN(start) || Number.isNaN(end) || end < start) return 0;
    return Math.floor((end - start) / (1000 * 60 * 60 * 24));
  }

  /** Clase de badge según el estado del caso. */
  getStatusBadgeClass(status?: string | null): string {
    switch ((status ?? '').toLowerCase()) {
      case 'open':
        return 'badge bg-info text-white';
      case 'in_progress':
        return 'badge bg-warning text-dark';
      case 'closed':
        return 'badge bg-success text-white';
      default:
        return 'badge bg-light text-dark';
    }
  }

  /** Clave i18n para etiqueta del estado. */
  getStatusLabelKey(status?: string | null): string {
    switch ((status ?? '').toLowerCase()) {
      case 'open':
        return 'adminCases.status.open';
      case 'in_progress':
        return 'adminCases.status.inProgress';
      case 'closed':
        return 'adminCases.status.closed';
      default:
        return 'adminCases.status.unknown';
    }
  }

  /** Clase de badge para el estado del profesional asignado. */
  getProfessionalStatusBadgeClass(status?: string | null): string {
    switch ((status ?? '').toUpperCase()) {
      case 'ACTIVE':
        return 'badge bg-success text-white';
      case 'INACTIVE':
        return 'badge bg-secondary';
      case 'SUSPENDED':
        return 'badge bg-warning text-dark';
      case 'BLOCKED':
        return 'badge bg-danger';
      default:
        return 'badge bg-light text-dark';
    }
  }

  trackById(_index: number, item: AdminCase): number {
    return item.id;
  }

  canTransferCase(): boolean {
    return this.roleService.canTransferCases();
  }

  /**
   * Abre el modal para transferir un caso a otro profesional (y muestra su historial)
   */
  openTransferModal(caseItem: AdminCase, event?: Event): void {
    event?.stopPropagation();
    if (!caseItem.id) return;

    this.transferTargetCase = caseItem;
    this.transferToProfessionalId = null;
    this.transferReason = '';
    this.transferHistory = [];
    this.loadProfessionals();
    this.loadTransferHistory(caseItem.id);

    this.transferModalRef = this.modalService.open(this.transferModal, { centered: true, size: 'lg' });
  }

  private loadProfessionals(): void {
    if (this.professionals.length > 0) return;

    this.isLoadingProfessionals = true;
    this.userService
      .getUsers(1, 100)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.professionals = users.filter(
            (u) => u.isActive && ['PSICOLOGO', 'ORIENTADOR', 'TRABAJO_SOCIAL'].includes(u.roleName || ''),
          );
          this.isLoadingProfessionals = false;
        },
        error: () => {
          this.isLoadingProfessionals = false;
        },
      });
  }

  private loadTransferHistory(caseId: number): void {
    this.isLoadingTransferHistory = true;
    this.caseService
      .getCaseTransfers(caseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transfers) => {
          this.transferHistory = transfers;
          this.isLoadingTransferHistory = false;
        },
        error: () => {
          this.isLoadingTransferHistory = false;
        },
      });
  }

  confirmTransfer(): void {
    if (!this.transferTargetCase?.id || this.isTransferring) return;

    if (!this.transferToProfessionalId) {
      this.notificationService.showWarning('Seleccione el profesional al que se transferirá el caso');
      return;
    }
    if (!this.transferReason.trim()) {
      this.notificationService.showWarning('Indique el motivo de la transferencia');
      return;
    }

    this.isTransferring = true;
    this.caseService
      .transferCase(this.transferTargetCase.id, {
        toProfessionalId: this.transferToProfessionalId,
        reason: this.transferReason.trim(),
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isTransferring = false;
          this.transferModalRef?.close();
          this.transferModalRef = null;
          this.loadCases();
        },
        error: () => {
          this.isTransferring = false;
        },
      });
  }

  getPersonName(person?: { firstName?: string | null; firstLastName?: string | null } | null): string {
    if (!person) return '—';
    return [person.firstName, person.firstLastName].filter(Boolean).join(' ') || '—';
  }
}
