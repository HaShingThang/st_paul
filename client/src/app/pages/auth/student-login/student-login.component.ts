import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.scss'],
})
export class StudentLoginComponent {
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
  studentLogin(student: any) {
    console.log(student);
  }
}
