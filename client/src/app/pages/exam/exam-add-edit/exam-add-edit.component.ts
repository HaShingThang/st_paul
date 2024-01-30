import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AcademicYear, ExamData, Grade } from 'src/app/interfaces/interfaces';
import { AdminService } from 'src/app/services/admin/admin.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GradeService } from 'src/app/services/grade/grade.service';
import { showDialog, toTitleCase } from 'src/app/utils/functions';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DATE_FORMAT } from 'src/app/utils/validators';
import * as moment from 'moment';
import { ExamService } from 'src/app/services/exam/exam.service';
import { AcademicYearService } from 'src/app/services/academic-year/academic-year.service';
import { errorMessageDialog, expiredDialog } from 'src/app/utils/alert-dialog';
import { CONST, periodPattern } from 'src/app/constants/constants';
import { noResultFound } from 'src/app/constants/messages';

@Component({
  selector: 'app-exam-add-edit',
  templateUrl: './exam-add-edit.component.html',
  styleUrls: ['./exam-add-edit.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
    { provide: DateAdapter, useClass: MomentDateAdapter },
  ],
})
export class ExamAddEditComponent implements OnInit {
  examForm!: FormGroup;
  grades!: Grade[];
  isUpdateMode = false;
  showSubmit = false;
  isLoading = true;
  editAccount = 'Exam Edit';
  getActiveYear!: number | undefined;

  examId!: number;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    public adminService: AdminService,
    private gradeService: GradeService,
    private academicYearService: AcademicYearService,
    private examService: ExamService
  ) {}

  async ngOnInit(): Promise<void> {
    const { id } = this.route.snapshot.params;

    this.examId = +id;
    this.isUpdateMode = !!id;
    this.setUpExamForm();
    this.gradeService.grades.subscribe({
      next: (data: Grade[]) => {
        if (data.length) {
          this.isLoading = true;
          this.grades = data.filter((grade: Grade) => grade.grade !== 'All');
        }
      },
      error: (error) => {
        this.isLoading = false;
        showDialog(error);
        this.router.navigate([`exams`]);
      },
    });
    this.academicYearService.academicYears.subscribe({
      next: (data: AcademicYear[]) => {
        const isAcademicYear = data.filter(
          (academicYear: AcademicYear) => academicYear.isActiveYear === true
        );
        if (isAcademicYear.length > 0) {
          this.getActiveYear = isAcademicYear[0].id;
        }
      },
    });
    if (this.isUpdateMode) {
      this.isLoading = true;
      if (id.length > CONST.MAX_ID_LENGTH) {
        this.isLoading = false;
        const result = await expiredDialog(noResultFound);
        if (result.isConfirmed) {
          this.router.navigate([`exams`]);
        } else {
          this.router.navigate([`exams`]);
        }
      } else if (isNaN(id)) {
        this.isLoading = false;
        const result = await expiredDialog(noResultFound);
        if (result.isConfirmed) {
          this.router.navigate([`exams`]);
        } else {
          this.router.navigate([`exams`]);
        }
      } else {
        this.examService.getExamById(this.examId).subscribe({
          next: (exam: ExamData) => {
            this.examForm.patchValue({
              period: exam.period,
              grade: exam.grade!.id,
              examDate: exam.examDate,
              examTime: exam.examTime.substring(0, 5),
              description: exam.description,
            });
            this.isLoading = false;
          },
          error: (error) => {
            this.isLoading = false;
            showDialog(error);
            this.router.navigate([`exams`]);
          },
        });
      }
    }
  }

  //Form Validation
  private setUpExamForm(): void {
    this.examForm = this.fb.group({
      period: ['', [Validators.required, Validators.pattern(periodPattern)]],
      grade: [, Validators.required],
      examDate: [moment(), Validators.required],
      examTime: [moment().format('HH:mm A'), Validators.required],
      description: [''],
    });
  }

  formDisable() {
    this.examForm.disable();
    this.showSubmit = true;
  }

  formEnable() {
    this.examForm.enable();
    this.showSubmit = false;
  }

  /// Submit
  examSubmit() {
    this.examForm.enable();
    this.showSubmit = false;
    let exam = this.examForm.value;
    const { period, grade, examDate, examTime, description } = exam;
    const formattedPeriod = toTitleCase(period);
    const time = moment(examTime, 'hh:mm A').format('HH:mm:ss.SSS');

    exam = {
      period: formattedPeriod,
      grade,
      examDate: moment(examDate).format('YYYY-MM-DD'),
      examTime: time,
      academicYear: this.getActiveYear,
      description,
    };
    if (this.isUpdateMode) {
      this.examService.updateExam(exam, this.examId);
    } else {
      if (!this.getActiveYear) {
        errorMessageDialog('There is no Active Year!');
        this.router.navigate(['/academic-year']);
        return;
      }
      this.examService.createExam(exam);
    }
  }
}
