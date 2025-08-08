import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-auth-signin-signup',
  templateUrl: './signin-signup.component.html',
  styleUrls: ['./signin-signup.component.scss']
})
export class SigninSignupComponent implements OnInit {

  returnUrl: string = '/';
  loading: boolean = false;

  loginForm!: FormGroup;
  loginFormSubmitted: boolean = false;
  loginError: string = '';

  signUpForm!: FormGroup;
  signupFormSubmitted: boolean = false;
  signupError: string = '';

  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: ['ubold@coderthemes.com', [Validators.required, Validators.email]],
      password: ['test', Validators.required]
    });

    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard-1';
  }

  /**
   * convenience getter for easy access to form fields
   */
  get loginFormFields() { return this.loginForm.controls; }

  /**
   * convenience getter for easy access to form fields
   */
  get signupFormFields() {
    return this.signUpForm.controls;
  }

  /**
  * On login form submit
  */
  onLogin(): void {
    this.loginFormSubmitted = true;
    if (this.loginForm.valid) {
      this.loading = true;
      this.authenticationService.login(this.loginFormFields.email?.value, this.loginFormFields.password?.value)
        .pipe(first())
        .subscribe(
          (data: any) => {
            this.router.navigate([this.returnUrl]);
          },
          (error: any) => {
            this.loginError = error;
            this.loading = false;
          });
    }
  }

  /**
 * On signup form submit
 */
  onSignup(): void {
    this.signupFormSubmitted = true;
    if (this.signUpForm.valid) {
      this.loading = true;
      this.authenticationService.signup(this.signupFormFields.name?.value, this.signupFormFields.email?.value, this.signupFormFields.password?.value)
        .pipe(first())
        .subscribe(
          (data: any) => {
            // navigates to confirm mail screen
            this.router.navigate(['/auth/confirm']);
          },
          (error: any) => {
            this.signupError = error;
            this.loading = false;
          });
    }
  }


}
