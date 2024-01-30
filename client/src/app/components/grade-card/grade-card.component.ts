import { Component, Input } from '@angular/core';
import { Grade } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GradeService } from 'src/app/services/grade/grade.service';

@Component({
  selector: 'app-grade-card',
  templateUrl: './grade-card.component.html',
  styleUrls: ['./grade-card.component.scss'],
})
export class GradeCardComponent {
  @Input() dashboardLink!: string;
  @Input() routerLink!: string;
  @Input() routerType!: string;
  @Input() link!: string;

  grades!: Grade[];
  isLoading = false;
  constructor(
    private gradeService: GradeService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.gradeService.getAllGrades().subscribe((data: Grade[]) => {
      this.grades = data;
      if (this.grades.length) {
        this.isLoading = false;
      }
    });
  }
}
