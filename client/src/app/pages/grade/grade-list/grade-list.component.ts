import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { createData } from 'src/app/constants/messages';
import { Grade } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GradeService } from 'src/app/services/grade/grade.service';
import { showDialog } from 'src/app/utils/functions';
import { GradeDialogComponent } from '../grade-dialog/grade-dialog.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-grade-list',
  templateUrl: './grade-list.component.html',
  styleUrls: ['./grade-list.component.scss'],
})
export class GradeListComponent implements OnInit {
  displayedColumns: string[] = [
    'No',
    'Grade',
    'Teacher Count',
    'Student Count',
  ];

  gradeData = new MatTableDataSource<Grade>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isLoading = false;
  noData!: string;

  constructor(
    private router: Router,
    public gradeService: GradeService,
    public authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.gradeService.getAllGrades().subscribe({
      next: (data) => {
        this.isLoading = false;
        if (!data.length) {
          this.noData = createData;
        }
        let teacherData = data.filter((grade: Grade) => grade.grade !== 'All');
        const grades = teacherData.map((data: Grade, index: number) => ({
          ...data,
          no: index + 1,
        }));
        this.gradeData.data = grades;
        this.gradeData.paginator = this.paginator;
      },
      error: (error) => {
        this.isLoading = false;
        showDialog(error);
        this.router.navigate(['/dashboard']);
      },
    });
  }

  /// Create Grade Dialog
  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    const dialogRef: MatDialogRef<GradeDialogComponent> = this.dialog.open(
      GradeDialogComponent,
      {
        width: '380px',
        enterAnimationDuration,
        exitAnimationDuration,
        data: this.gradeData.data,
      }
    );

    dialogRef.afterClosed().subscribe((grade) => {
      if (!grade) return;
      this.isLoading = true;
      this.gradeService.createGrade(grade).subscribe({
        next: (_) => {
          this.ngOnInit();
        },
        error: (error) => {
          this.isLoading = false;
          showDialog(error);
        },
      });
    });
  }
}
