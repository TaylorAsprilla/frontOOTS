import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-test-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h3>Test Form - ¿Se ve este formulario?</h3>

      <div class="card">
        <div class="card-body">
          <form [formGroup]="testForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label for="name" class="form-label">Nombre de prueba</label>
              <input
                type="text"
                class="form-control"
                id="name"
                formControlName="name"
                placeholder="Escribe tu nombre aquí"
              />
            </div>

            <div class="mb-3">
              <label for="email" class="form-label">Email de prueba</label>
              <input
                type="email"
                class="form-control"
                id="email"
                formControlName="email"
                placeholder="email@ejemplo.com"
              />
            </div>

            <button type="submit" class="btn btn-primary">Enviar Test</button>
          </form>

          <div class="mt-3">
            <h5>Debug Info:</h5>
            <pre>{{ testForm.value | json }}</pre>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TestFormComponent {
  testForm: FormGroup;

  constructor(private fb: FormBuilder) {
    console.log('TestFormComponent constructor');
    this.testForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    console.log('Test form submitted:', this.testForm.value);
  }
}
