import { Component, OnInit } from '@angular/core';
import { Grade } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GradeService } from 'src/app/services/grade/grade.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
})
export class StudentDashboardComponent {}
