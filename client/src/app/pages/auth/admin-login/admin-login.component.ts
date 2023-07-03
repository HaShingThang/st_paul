import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ROLES } from 'src/app/constants/constants';
import { serverError } from 'src/app/constants/messages';
import { AuthService } from 'src/app/services/auth/auth.service';
import { errorMessageDialog } from 'src/app/utils/alert-dialog';
import { showDialog } from 'src/app/utils/functions';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent {
  redirectUrl: string = '';
  isLoading = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.redirectUrl = params['redirectUrl'];
    });
    if (this.authService.isAuth()) {
      this.router.navigate(['/dashboard']);
    }
  }

  adminLogin(admin: any) {
    this.isLoading = true;
    const email = admin.email.toLowerCase();
    const password = admin.password.replace(/\s/g, '');
    const role = "Admin"
    this.authService.login(email, password, role).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.loginSuccess(response);
      },
      error: (error) => {
        this.isLoading = false;
        errorMessageDialog(error.error.message ?? serverError);
      },
    });
  }

  private loginSuccess(response: any) {
    localStorage.setItem('token', response.jwt);
    this.authService.setAuth(response.jwt);
    if (this.redirectUrl) {
      this.router.navigate([this.redirectUrl]);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
