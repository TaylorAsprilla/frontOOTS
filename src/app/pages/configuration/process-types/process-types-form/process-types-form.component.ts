import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProcessTypeService } from '../process-type.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-process-types-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './process-types-form.component.html',
  styleUrl: './process-types-form.component.scss',
})
export class ProcessTypesFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly processTypeService = inject(ProcessTypeService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  processTypeForm: FormGroup;
  isEditMode = false;
  processTypeId: number | null = null;
  isLoading = false;
  isSubmitting = false;

  constructor() {
    this.processTypeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.checkEditMode();
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.processTypeId = +id;
      this.loadProcessType(this.processTypeId);
    }
  }

  private loadProcessType(id: number): void {
    this.isLoading = true;
    this.processTypeService.getById(id).subscribe({
      next: (response) => {
        this.processTypeForm.patchValue(response.data);
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Error al cargar el tipo de proceso');
        this.router.navigate(['/configuration/process-types']);
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.processTypeForm.invalid) {
      this.processTypeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.processTypeForm.value;

    const request = this.isEditMode
      ? this.processTypeService.update(this.processTypeId!, formData)
      : this.processTypeService.create(formData);

    request.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.isEditMode ? 'Tipo de proceso actualizado correctamente' : 'Tipo de proceso creado correctamente'
        );
        this.router.navigate(['/configuration/process-types']);
      },
      error: () => {
        this.notificationService.showError('Error al guardar el tipo de proceso');
        this.isSubmitting = false;
      },
    });
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.processTypeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.processTypeForm.get(fieldName);
    if (field?.hasError('required')) return 'Este campo es requerido';
    if (field?.hasError('minlength')) return 'Mínimo 2 caracteres';
    if (field?.hasError('maxlength'))
      return fieldName === 'description' ? 'Máximo 500 caracteres' : 'Máximo 100 caracteres';
    return '';
  }
}
