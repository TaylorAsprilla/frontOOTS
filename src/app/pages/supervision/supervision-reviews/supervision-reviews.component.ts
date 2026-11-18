import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, of, switchMap, takeUntil } from 'rxjs';

import {
  CaseSearchResult,
  CatalogItem,
  ITEM_STATUSES,
  ItemStatus,
  ReviewType,
  SupervisionCatalog,
  SupervisionPerson,
  SupervisionReview,
  SupervisionService,
} from '../../../core/services/supervision.service';
import { RoleService } from '../../../core/services/role.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LocalizedDatePipe } from '../../../core/pipes/localized-date.pipe';

/**
 * Revisiones de supervisión: listas de control de calidad del expediente de un
 * participante ("Orden de Expediente") o del supervisado ("Orden Expediente – Supervisión").
 * SUPERVISOR y ADMIN las elaboran y firman; ADMIN_COUNTRY solo las consulta.
 */
@Component({
  selector: 'app-supervision-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, LocalizedDatePipe],
  templateUrl: './supervision-reviews.component.html',
})
export class SupervisionReviewsComponent implements OnInit, OnDestroy {
  private readonly service = inject(SupervisionService);
  private readonly roleService = inject(RoleService);
  private readonly notifications = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();
  private readonly caseSearch$ = new Subject<string>();

  readonly statuses = ITEM_STATUSES;
  readonly typeLabels: Record<ReviewType, string> = {
    CASE_FILE: 'Expediente del participante',
    SUPERVISEE_FILE: 'Expediente del supervisado',
  };

  canEdit = this.roleService.isAdmin() || this.roleService.isSupervisor();

  catalog: SupervisionCatalog | null = null;
  reviews: SupervisionReview[] = [];
  supervisees: SupervisionPerson[] = [];
  isLoading = false;
  filterType: ReviewType | '' = '';
  filterSuperviseeId: number | null = null;
  filterCaseId: number | null = null;

  // Buscador de casos
  caseTerm = '';
  caseResults: CaseSearchResult[] = [];
  selectedCase: CaseSearchResult | null = null;

  // Nueva revisión
  showCreate = false;
  newType: ReviewType = 'SUPERVISEE_FILE';
  newCaseId: number | null = null;
  newSuperviseeId: number | null = null;
  newPeriod = new Date().toISOString().slice(0, 7);
  newCasesCount: number | null = null;
  isCreating = false;

  // Edición
  current: SupervisionReview | null = null;
  isSaving = false;

  ngOnInit(): void {
    this.service
      .catalog()
      .pipe(takeUntil(this.destroy$))
      .subscribe((catalog) => (this.catalog = catalog));
    if (this.canEdit) {
      this.service
        .supervisees()
        .pipe(takeUntil(this.destroy$))
        .subscribe((rows) => (this.supervisees = rows));
    }
    this.caseSearch$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => (term.trim().length < 2 ? of([]) : this.service.searchCases(term))),
        takeUntil(this.destroy$),
      )
      .subscribe((rows) => (this.caseResults = rows));

    // Acceso desde el expediente: /cases/supervision?caseId=ID
    const caseId = Number(this.route.snapshot.queryParamMap.get('caseId'));
    if (Number.isInteger(caseId) && caseId > 0) {
      this.filterCaseId = caseId;
      if (this.canEdit) {
        this.showCreate = true;
        this.newType = 'CASE_FILE';
        this.newCaseId = caseId;
        this.caseTerm = `Caso ${caseId}`;
      }
    }
    this.load();
  }

  onCaseTermChange(term: string): void {
    this.selectedCase = null;
    this.newCaseId = null;
    this.caseSearch$.next(term);
  }

  pickCase(result: CaseSearchResult): void {
    this.selectedCase = result;
    this.newCaseId = result.id;
    this.caseTerm = `${result.caseNumber ?? 'Caso ' + result.id} — ${result.participantName}`;
    this.caseResults = [];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.isLoading = true;
    this.service
      .list({
        type: this.filterType || undefined,
        caseId: this.filterCaseId ?? undefined,
        superviseeId: this.filterSuperviseeId ?? undefined,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rows) => {
          this.reviews = rows;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.notifications.showError('No fue posible cargar las revisiones');
        },
      });
  }

  // ── Creación ──────────────────────────────────────────────────────────
  create(): void {
    if (this.isCreating) return;
    if (this.newType === 'CASE_FILE' && !this.newCaseId) {
      this.notifications.showWarning('Busque y seleccione el caso a revisar');
      return;
    }
    if (this.newType === 'SUPERVISEE_FILE' && !this.newSuperviseeId) {
      this.notifications.showWarning('Seleccione el supervisado');
      return;
    }
    this.isCreating = true;
    this.service
      .create({
        type: this.newType,
        caseId: this.newType === 'CASE_FILE' ? this.newCaseId! : undefined,
        superviseeId: this.newType === 'SUPERVISEE_FILE' ? this.newSuperviseeId! : undefined,
        period: this.newType === 'SUPERVISEE_FILE' ? this.newPeriod || undefined : undefined,
        casesCount: this.newType === 'SUPERVISEE_FILE' && this.newCasesCount !== null ? this.newCasesCount : undefined,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (review) => {
          this.isCreating = false;
          this.showCreate = false;
          this.open(review);
          if (review.type === 'CASE_FILE' && review.caseId) this.applySuggestions();
          this.load();
        },
        error: (error) => {
          this.isCreating = false;
          this.notifications.showError(error?.error?.message || 'No fue posible crear la revisión');
        },
      });
  }

  // ── Edición ───────────────────────────────────────────────────────────
  open(review: SupervisionReview): void {
    this.current = { ...review, items: { ...(review.items ?? {}) } };
  }

  clearCaseFilter(): void {
    this.filterCaseId = null;
    this.load();
  }

  openById(review: SupervisionReview): void {
    this.service
      .get(review.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((full) => this.open(full));
  }

  close(): void {
    this.current = null;
    this.load();
  }

  get readOnly(): boolean {
    return !this.current || this.current.status === 'SIGNED' || !this.canEdit;
  }

  groups(): { name: string; items: CatalogItem[] }[] {
    if (!this.current || !this.catalog) return [];
    const map = new Map<string, CatalogItem[]>();
    for (const item of this.catalog[this.current.type]) {
      map.set(item.group, [...(map.get(item.group) ?? []), item]);
    }
    return [...map.entries()].map(([name, items]) => ({ name, items }));
  }

  setItem(key: string, value: ItemStatus): void {
    if (this.readOnly || !this.current) return;
    this.current.items[key] = value;
  }

  pendingCount(): number {
    if (!this.current || !this.catalog) return 0;
    return this.catalog[this.current.type].filter((item) => !this.current!.items[item.key]).length;
  }

  /** Marca ✓ lo que el sistema ya encuentra registrado; el supervisor confirma o corrige */
  applySuggestions(): void {
    if (!this.current?.caseId) return;
    this.service
      .suggestions(this.current.caseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((suggested) => {
        if (!this.current) return;
        let applied = 0;
        for (const [key, value] of Object.entries(suggested)) {
          if (!this.current.items[key]) {
            this.current.items[key] = value;
            applied++;
          }
        }
        this.notifications.showSuccess(
          applied > 0
            ? `${applied} ítems precompletados según lo registrado; revíselos`
            : 'No hay ítems por precompletar',
        );
      });
  }

  save(onDone?: () => void): void {
    if (!this.current || this.isSaving || this.readOnly) return;
    this.isSaving = true;
    this.service
      .update(this.current.id, {
        period: this.current.period || undefined,
        casesCount: this.current.casesCount ?? undefined,
        items: this.current.items,
        recommendations: this.current.recommendations ?? '',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (review) => {
          this.isSaving = false;
          this.open(review);
          this.notifications.showSuccess('Revisión guardada');
          onDone?.();
        },
        error: (error) => {
          this.isSaving = false;
          this.notifications.showError(error?.error?.message || 'No fue posible guardar la revisión');
        },
      });
  }

  sign(): void {
    if (!this.current || this.readOnly) return;
    if (this.pendingCount() > 0) {
      this.notifications.showWarning(`Faltan ${this.pendingCount()} ítems por calificar`);
      return;
    }
    if (!window.confirm('Al firmar, la revisión queda cerrada y no podrá modificarse. ¿Desea firmarla?')) return;
    const id = this.current.id;
    this.save(() => {
      this.service
        .sign(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (review) => {
            this.open(review);
            this.notifications.showSuccess('Revisión firmada');
          },
          error: (error) => this.notifications.showError(error?.error?.message || 'No fue posible firmar la revisión'),
        });
    });
  }

  downloadPdf(review: SupervisionReview): void {
    this.service
      .downloadPdf(review.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = `revision-supervision-${review.id}.pdf`;
          anchor.click();
          URL.revokeObjectURL(url);
        },
        error: () => this.notifications.showError('No fue posible descargar el PDF'),
      });
  }

  subject(review: SupervisionReview): string {
    if (review.type === 'CASE_FILE') {
      const participant = review.case?.participant;
      const name = [participant?.firstName, participant?.firstLastName].filter(Boolean).join(' ');
      return `Expediente ${review.case?.caseNumber ?? review.caseId}${name ? ' — ' + name : ''}`;
    }
    return this.personName(review.supervisee);
  }

  personName(person?: { firstName?: string; firstLastName?: string } | null): string {
    if (!person) return '—';
    return [person.firstName, person.firstLastName].filter(Boolean).join(' ') || '—';
  }
}
