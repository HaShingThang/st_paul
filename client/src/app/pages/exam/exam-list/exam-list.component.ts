import { Component, ViewChild } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  createData,
  deleteMessage,
  isAdmin,
  noResultFound,
  searching,
} from 'src/app/constants/messages';
import { ExamData, Grade } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ExamService } from 'src/app/services/exam/exam.service';
import { GradeService } from 'src/app/services/grade/grade.service';
import {
  confirmationDialog,
  errorMessageDialog,
} from 'src/app/utils/alert-dialog';
import { showDialog } from 'src/app/utils/functions';
import { DATE_FORMAT } from 'src/app/utils/validators';

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
    { provide: DateAdapter, useClass: MomentDateAdapter },
  ],
})
export class ExamListComponent {
  displayedColumns: string[] = [
    'No',
    'Period',
    'Grade',
    'Exam Date',
    'Exam Time',
    'Description',
  ];

  examData = new MatTableDataSource<ExamData>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  grades!: Grade[];
  grade = 'All';
  examDate = '';
  examTime = '';
  searchValue = '';
  isLoading = false;
  noData = '';
  searching = '';

  constructor(
    public router: Router,
    public authService: AuthService,
    private gradeService: GradeService,
    public examService: ExamService
  ) {
    if (this.authService.isAdmin()) {
      this.displayedColumns.push('Action');
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.gradeService.grades.subscribe({
      next: (data: Grade[]) => {
        if (data.length) {
          this.grades = data;
        }
      },
      error: (error) => {
        this.isLoading = false;
        showDialog(error);
        this.router.navigate([`exams`]);
      },
    });
    this.examService.getAllExams().subscribe({
      next: (data) => {
        this.isLoading = false;
        if (!data.length) {
          this.noData = createData;
          this.isLoading = false;
        }
        let academicYear = data.map((data: ExamData, index: number) => ({
          ...data,
          no: index + 1,
        }));
        this.examData.data = academicYear;
        this.examData.paginator = this.paginator;
      },
      error: (error) => {
        this.isLoading = false;
        showDialog(error);
        this.router.navigate(['/dashboard']);
      },
    });
  }

  ngAfterViewInit(): void {
    this.examData.paginator = this.paginator;
    this.examData.sort = this.sort;
  }

  /// Delete
  async deleteExam(exam: any) {
    if (!this.authService.isAdmin()) {
      errorMessageDialog(`${isAdmin} "${exam.period}"`);
    } else {
      const title = `${deleteMessage} "${exam.period}"?`;
      const result = await confirmationDialog(title);
      if (result.isConfirmed) {
        this.examService.deleteExam(exam).subscribe({
          next: () => {
            const index = this.examData.data.findIndex((s) => s.id === exam.id);
            if (index !== -1) {
              this.examData.data.splice(index, 1);
              for (let i = index; i < this.examData.data.length; i++) {
                this.examData.data[i].no = i + 1;
              }
              this.examData._updateChangeSubscription();
            }
            if (!this.examData.data.length) {
              this.noData = createData;
            }
          },
          error: (error) => {
            showDialog(error);
          },
        });
      }
    }
  }

  //Search
  searchExam() {
    if (
      !this.searchValue &&
      this.grade == 'All' &&
      !this.examDate &&
      !this.examTime
    ) {
      return this.ngOnInit();
    }
    this.searching = searching;
    this.isLoading = true;
    this.examService
      .getAllExams(this.grade, this.searchValue, this.examDate, this.examTime)
      .subscribe({
        next: (data) => {
          let studentData = data;
          studentData = studentData.map((data: ExamData, index: number) => ({
            ...data,
            no: index + 1,
          }));
          this.examData.data = studentData;
          if (this.examData.data.length) {
            this.isLoading = false;
            this.noData = '';
            this.searching = '';
            this.examData.sort = this.sort;
            this.examData.paginator = this.paginator;
          } else {
            this.searching = '';
            this.noData = noResultFound;
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.isLoading = false;
          showDialog(error);
          this.router.navigate(['/dashboard']);
        },
      });
  }

  //Clear Search
  clearSearch() {
    this.searchValue = '';
    this.noData = '';
    if (
      !this.searchValue &&
      this.grade == 'All' &&
      !this.examDate &&
      !this.examTime
    ) {
      return this.ngOnInit();
    } else {
      return this.searchExam();
    }
  }
  clearAllSearch() {
    this.searchValue = '';
    this.noData = '';
    this.examDate = '';
    this.examTime = '';
    this.grade = 'All';
    return this.ngOnInit();
  }
}
