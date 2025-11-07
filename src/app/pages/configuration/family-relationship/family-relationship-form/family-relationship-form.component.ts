import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FamilyRelationshipService } from '../family-relationship.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-family-relationship-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './family-relationship-form.component.html',
  styleUrl: './family-relationship-form.component.scss',
})
export class FamilyRelationshipFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly familyRelationshipService = inject(FamilyRelationshipService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  familyRelationshipForm: FormGroup;
  isEditMode = false;
  familyRelationshipId: number | null = null;
  isLoading = false;
  isSubmitting = false;

  constructor() {
    this.familyRelationshipForm = this.fb.group({
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
      this.familyRelationshipId = +id;
      this.loadFamilyRelationship(this.familyRelationshipId);
    }
  }

  private loadFamilyRelationship(id: number): void {
    this.isLoading = true;
    this.familyRelationshipService.getFamilyRelationshipById(id).subscribe({
      next: (response) => {
        this.familyRelationshipForm.patchValue(response.data);
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Error al cargar el Parentesco');
        this.router.navigate(['/configuration/family-relationship']);
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.familyRelationshipForm.invalid) {
      this.familyRelationshipForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.familyRelationshipForm.value;

    const request = this.isEditMode
      ? this.familyRelationshipService.updateFamilyRelationship(this.familyRelationshipId!, formData)
      : this.familyRelationshipService.createFamilyRelationship(formData);

    request.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.isEditMode ? 'Estado civil actualizado correctamente' : 'Estado civil creado correctamente'
        );
        this.router.navigate(['/configuration/family-relationship']);
      },
      error: () => {
        this.notificationService.showError('Error al guardar el Parentesco');
        this.isSubmitting = false;
      },
    });
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.familyRelationshipForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.familyRelationshipForm.get(fieldName);
    if (field?.hasError('required')) return 'Este campo es requerido';
    if (field?.hasError('minlength')) return 'Mínimo 2 caracteres';
    if (field?.hasError('maxlength')) return 'Máximo 100 caracteres';
    return '';
  }
}
