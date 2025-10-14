import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/service/auth.service';
import { DefaultLayoutComponent } from 'src/app/shared/ui/default-layout/default-layout.component';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss'],
  imports: [DefaultLayoutComponent, RouterModule, ReactiveFormsModule, NgbAlert, CommonModule],
})
export class LockScreenComponent implements OnInit {
  lockScreenForm!: FormGroup;
  formSubmitted: boolean = false;
  error: string = '';

  constructor(private router: Router, private authenticationService: AuthenticationService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.lockScreenForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  /**
   * convenience getter for easy access to form fields
   */
  get formValues() {
    return this.lockScreenForm.controls;
  }

  /**
   * On submit form
   */
  onSubmit(): void {
    this.formSubmitted = true;
    if (this.lockScreenForm.valid) {
      this.authenticationService
        .login(this.authenticationService.currentUser()?.email!, this.formValues.password?.value)
        .pipe(first())
        .subscribe(
          (data: any) => {
            this.router.navigate(['/']);
          },
          (error: any) => {
            this.error = error;
          }
        );
    }
  }
}
