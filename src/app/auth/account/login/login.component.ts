import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/service/auth.service';
import { DefaultLayoutComponent } from 'src/app/shared/ui/default-layout/default-layout.component';
import { PreloaderComponent } from 'src/app/shared/widget/preloader/preloader.component';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    DefaultLayoutComponent,
    RouterModule,
    PreloaderComponent,
    NgbAlert,
    ReactiveFormsModule,
    TranslocoModule,
  ],
})
export class LoginComponent implements OnInit {
  loading: boolean = false;
  returnUrl: string = '/';

  loginForm!: FormGroup;
  formSubmitted: boolean = false;
  error: string = '';

  showPassword: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard-1';
  }

  /**
   * convenience getter for easy access to form fields
   */
  get formValues() {
    return this.loginForm.controls;
  }

  /**
   * On submit form
   */
  onSubmit(): void {
    this.formSubmitted = true;
    this.error = '';

    if (this.loginForm.valid) {
      this.loading = true;

      this.authenticationService
        .login(this.formValues.email?.value, this.formValues.password?.value)
        .pipe(first())
        .subscribe({
          next: (authenticatedUser) => {
            console.log('Login successful:', authenticatedUser);
            // Navegar al dashboard o a la URL de retorno
            this.router.navigate([this.returnUrl]);
          },
          error: (errorMessage: string) => {
            console.error('Login failed:', errorMessage);
            this.error = errorMessage;
            this.loading = false;
          },
        });
    }
  }
}
