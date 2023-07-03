import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ROLES } from 'src/app/constants/constants';
import { AuthService } from 'src/app/services/auth/auth.service';
import { showDialog } from 'src/app/utils/functions';

@Component({
  selector: 'app-teacher-login',
  templateUrl: './teacher-login.component.html',
  styleUrls: ['./teacher-login.component.scss'],
})
export class TeacherLoginComponent {
  redirectUrl: string = '';
  isLoading = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: { [x: string]: string }) => {
      this.redirectUrl = params['redirectUrl'];
    });
    if (this.authService.isAuth()) {
      this.router.navigate(['/dashboard']);
    }
  }

  teacherLogin(teacher: any) {
    this.isLoading = true;
    const email = teacher.email.toLowerCase();
    const password = teacher.password.replace(/\s/g, '');
    const role = "Teacher"
    this.authService.login(email, password, role).subscribe({
      next: (response) => {
        this.loginSuccess(response);
        this.isLoading = false;
      },
      error: (error) => {
        showDialog(error);
        this.isLoading = false;
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
