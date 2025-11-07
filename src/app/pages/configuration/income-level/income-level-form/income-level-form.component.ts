import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IncomeLevelService } from '../income-level.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-income-level-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './income-level-form.component.html',
  styleUrl: './income-level-form.component.scss',
})
export class IncomeLevelFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly incomeLevelService = inject(IncomeLevelService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  incomeLevelForm: FormGroup;
  isEditMode = false;
  incomeLevelId: number | null = null;
  isLoading = false;
  isSubmitting = false;

  constructor() {
    this.incomeLevelForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
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
      this.incomeLevelId = +id;
      this.loadIncomeLevel(this.incomeLevelId);
    }
  }

  private loadIncomeLevel(id: number): void {
    this.isLoading = true;
    this.incomeLevelService.getIncomeLevelById(id).subscribe({
      next: (response) => {
        this.incomeLevelForm.patchValue(response.data);
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Error al cargar el Nivel de Ingresos');
        this.router.navigate(['/configuration/income-level']);
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.incomeLevelForm.invalid) {
      this.incomeLevelForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.incomeLevelForm.value;

    const request = this.isEditMode
      ? this.incomeLevelService.updateIncomeLevel(this.incomeLevelId!, formData)
      : this.incomeLevelService.createIncomeLevel(formData);

    request.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.isEditMode ? 'Estado civil actualizado correctamente' : 'Estado civil creado correctamente'
        );
        this.router.navigate(['/configuration/income-level']);
      },
      error: () => {
        this.notificationService.showError('Error al guardar el Nivel de Ingresos');
        this.isSubmitting = false;
      },
    });
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.incomeLevelForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.incomeLevelForm.get(fieldName);
    if (field?.hasError('required')) return 'Este campo es requerido';
    if (field?.hasError('minlength')) return 'Mínimo 2 caracteres';
    if (field?.hasError('maxlength')) return 'Máximo 100 caracteres';
    return '';
  }
}
