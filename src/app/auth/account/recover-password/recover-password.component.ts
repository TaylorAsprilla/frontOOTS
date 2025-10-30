import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from 'src/app/shared/ui/default-layout/default-layout.component';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-auth-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss'],
  imports: [DefaultLayoutComponent, RouterModule, NgbAlert, ReactiveFormsModule, CommonModule],
})
export class RecoverPasswordComponent implements OnInit {
  resetPassswordForm!: FormGroup;
  formSubmitted: boolean = false;
  successMessage: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.resetPassswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  /**
   * convenience getter for easy access to form fields
   */
  get formValues() {
    return this.resetPassswordForm.controls;
  }

  /**
   * On form submit
   */
  onSubmit(): void {
    this.formSubmitted = true;
    if (this.resetPassswordForm.valid) {
      this.successMessage = 'We have sent you an email containing a link to reset your password';
    }
  }
}
