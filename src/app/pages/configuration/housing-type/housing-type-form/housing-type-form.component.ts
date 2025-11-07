import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HousingTypeService } from '../housing-type.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-housing-type-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './housing-type-form.component.html',
  styleUrl: './housing-type-form.component.scss',
})
export class HousingTypeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly housingTypeService = inject(HousingTypeService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  housingTypeForm: FormGroup;
  isEditMode = false;
  housingTypeId: number | null = null;
  isLoading = false;
  isSubmitting = false;

  constructor() {
    this.housingTypeForm = this.fb.group({
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
      this.housingTypeId = +id;
      this.loadHousingType(this.housingTypeId);
    }
  }

  private loadHousingType(id: number): void {
    this.isLoading = true;
    this.housingTypeService.getHousingTypeById(id).subscribe({
      next: (response) => {
        this.housingTypeForm.patchValue(response.data);
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Error al cargar el Tipo de Vivienda');
        this.router.navigate(['/configuration/housing-type']);
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.housingTypeForm.invalid) {
      this.housingTypeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.housingTypeForm.value;

    const request = this.isEditMode
      ? this.housingTypeService.updateHousingType(this.housingTypeId!, formData)
      : this.housingTypeService.createHousingType(formData);

    request.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.isEditMode ? 'Estado civil actualizado correctamente' : 'Estado civil creado correctamente'
        );
        this.router.navigate(['/configuration/housing-type']);
      },
      error: () => {
        this.notificationService.showError('Error al guardar el Tipo de Vivienda');
        this.isSubmitting = false;
      },
    });
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.housingTypeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.housingTypeForm.get(fieldName);
    if (field?.hasError('required')) return 'Este campo es requerido';
    if (field?.hasError('minlength')) return 'Mínimo 2 caracteres';
    if (field?.hasError('maxlength')) return 'Máximo 100 caracteres';
    return '';
  }
}
