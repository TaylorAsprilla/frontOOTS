import { Component, Input, OnChanges, OnDestroy, SimpleChanges, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import {
  ALLOWED_EXTENSIONS,
  AttachmentCategory,
  AttachmentContext,
  CATEGORIES_BY_CONTEXT,
  CATEGORY_LABELS,
  CaseAttachment,
  CaseAttachmentService,
  MAX_FILE_MB,
} from '../../../core/services/case-attachment.service';
import { NotificationService } from '../../../core/services/notification.service';

interface QueueItem {
  file: File;
  category: AttachmentCategory | '';
  description: string;
  signedAt: string;
  progress: number;
  uploading: boolean;
  error: string;
  subscription?: Subscription;
}

/**
 * Componente único para adjuntar, listar y descargar documentos (PDF/Word)
 * de un caso o consulta breve. Se reutiliza en Documentación y Consentimientos,
 * Plan a Seguir (referido) y Referidos. El backend valida todo de nuevo.
 */
@Component({
  selector: 'app-case-attachments',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './case-attachments.component.html',
})
export class CaseAttachmentsComponent implements OnChanges, OnDestroy {
  private readonly service = inject(CaseAttachmentService);
  private readonly notifications = inject(NotificationService);

  @Input({ required: true }) caseId!: number;
  @Input({ required: true }) context!: AttachmentContext;
  /** Expediente cerrado o en modo consulta: solo ver y descargar */
  @Input() readOnly = false;
  @Input() title = '';
  @Input() description = '';
  /** Muestra la fecha de firma (consentimientos) */
  @Input() showSignedAt = false;

  readonly accept = ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(',');
  readonly maxMb = MAX_FILE_MB;

  attachments: CaseAttachment[] = [];
  queue: QueueItem[] = [];
  isLoading = false;
  downloadingId: number | null = null;
  deletingId: number | null = null;

  get categories(): AttachmentCategory[] {
    return CATEGORIES_BY_CONTEXT[this.context] ?? [];
  }

  label(category: AttachmentCategory): string {
    return CATEGORY_LABELS[category] ?? category;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['caseId'] || changes['context']) && this.caseId) {
      this.load();
    }
  }

  ngOnDestroy(): void {
    this.queue.forEach((item) => item.subscription?.unsubscribe());
  }

  load(): void {
    this.isLoading = true;
    this.service.list(this.caseId, this.context).subscribe({
      next: (rows) => {
        this.attachments = rows;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.notifications.showError('No fue posible cargar los documentos');
      },
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    for (const file of files) {
      const error = this.validate(file);
      this.queue.push({
        file,
        category: this.categories.length === 1 ? this.categories[0] : '',
        description: '',
        signedAt: '',
        progress: 0,
        uploading: false,
        error,
      });
    }
  }

  /** Validación de cortesía; el backend es quien decide */
  private validate(file: File): string {
    const ext = file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase() : '';
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return 'Formato no permitido. Solo se aceptan archivos PDF y Word (.doc, .docx)';
    }
    if (file.size > this.maxMb * 1024 * 1024) {
      return `El archivo supera el tamaño máximo de ${this.maxMb} MB`;
    }
    if (file.size === 0) return 'El archivo está vacío';
    return '';
  }

  needsDescription(item: QueueItem): boolean {
    return item.category === 'OTHER';
  }

  canUpload(item: QueueItem): boolean {
    return (
      !item.uploading &&
      !item.error &&
      !!item.category &&
      (!this.needsDescription(item) || !!item.description.trim())
    );
  }

  upload(item: QueueItem): void {
    if (!item.category) {
      item.error = 'Seleccione el tipo de documento';
      return;
    }
    if (this.needsDescription(item) && !item.description.trim()) {
      item.error = 'Para "Otros" indique el nombre o descripción del documento';
      return;
    }
    item.error = '';
    item.uploading = true;
    item.progress = 0;
    item.subscription = this.service
      .upload({
        caseId: this.caseId,
        context: this.context,
        category: item.category,
        file: item.file,
        description: item.description,
        signedAt: this.showSignedAt ? item.signedAt : undefined,
      })
      .subscribe({
        next: (event) => {
          if ('progress' in event) {
            item.progress = event.progress;
          } else {
            this.queue = this.queue.filter((queued) => queued !== item);
            this.attachments = [event.done, ...this.attachments];
            this.notifications.showSuccess('Documento adjuntado correctamente');
          }
        },
        error: (error) => {
          item.uploading = false;
          item.progress = 0;
          const message = error?.error?.message;
          item.error = Array.isArray(message) ? message.join(', ') : message || 'No fue posible adjuntar el documento';
        },
      });
  }

  /** Cancela una carga en curso o descarta el archivo seleccionado */
  cancel(item: QueueItem): void {
    item.subscription?.unsubscribe();
    this.queue = this.queue.filter((queued) => queued !== item);
  }

  download(attachment: CaseAttachment): void {
    if (this.downloadingId !== null) return;
    this.downloadingId = attachment.id;
    this.service.getDownloadUrl(attachment.id).subscribe({
      next: ({ url }) => {
        this.downloadingId = null;
        window.open(url, '_self');
      },
      error: (error) => {
        this.downloadingId = null;
        this.notifications.showError(error?.error?.message || 'No fue posible descargar el documento');
      },
    });
  }

  remove(attachment: CaseAttachment): void {
    if (this.deletingId !== null) return;
    if (!window.confirm(`¿Eliminar el documento "${attachment.originalName}"? Se conservará el registro de auditoría.`)) {
      return;
    }
    this.deletingId = attachment.id;
    this.service.remove(attachment.id).subscribe({
      next: () => {
        this.deletingId = null;
        this.attachments = this.attachments.filter((row) => row.id !== attachment.id);
        this.notifications.showSuccess('Documento eliminado');
      },
      error: (error) => {
        this.deletingId = null;
        this.notifications.showError(error?.error?.message || 'No fue posible eliminar el documento');
      },
    });
  }

  sizeLabel(bytes: number): string {
    return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
}
