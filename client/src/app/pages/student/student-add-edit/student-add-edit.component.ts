import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { CONST } from 'src/app/constants/constants';
import { noResultFound } from 'src/app/constants/messages';
import {
  AcademicYear,
  Grade,
  GradeData,
  StudentData,
} from 'src/app/interfaces/interfaces';
import { AcademicYearService } from 'src/app/services/academic-year/academic-year.service';
import { GradeService } from 'src/app/services/grade/grade.service';
import { StudentService } from 'src/app/services/student/student.service';
import { errorMessageDialog, expiredDialog } from 'src/app/utils/alert-dialog';
import { showDialog } from 'src/app/utils/functions';
import { getGradeNumber, validatePhoneNumber } from 'src/app/utils/validators';

@Component({
  selector: 'app-student-add-edit',
  templateUrl: './student-add-edit.component.html',
  styleUrls: ['./student-add-edit.component.scss'],
})
export class StudentAddEditComponent {
  studentForm!: FormGroup;
  studentId!: number;
  guardianId!: number | undefined;
  hide = true;
  isUpdateMode = false;
  isLoading = false;
  showSubmit = false;
  errorMessage = '';
  getParam!: string;
  getGradeId!: number | undefined;
  getActiveYear!: number | undefined;
  isChangeGuardianInfo = false;

  grades!: Grade[];
  academicYears!: AcademicYear[];
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public studentService: StudentService,
    private gradeService: GradeService,
    private academicYearService: AcademicYearService
  ) {}

  async ngOnInit(): Promise<void> {
    const { grade, id } = this.route.snapshot.params;
    this.getParam = grade;
    this.studentId = +id;
    this.isUpdateMode = !!id;
    this.setUpStudentForm();
    this.gradeChanges();
    this.academicYearService.academicYears.subscribe({
      next: (data: AcademicYear[]) => {
        this.academicYears = data;
        const filteredActiveYear = data.filter(
          (academicYear: AcademicYear) => academicYear.isActiveYear === true
        );
        if (filteredActiveYear.length > 0) {
          this.getActiveYear = filteredActiveYear[0].id;
          this.studentForm.patchValue({
            academicYear: this.getActiveYear,
          });
        }
      },
      error: (error) => {
        showDialog(error);
        this.router.navigate([`students`]);
      },
    });
    this.gradeService.grades.subscribe({
      next: (data: Grade[]) => {
        if (data.length) {
          this.isLoading = true;
          this.grades = data.filter((grade: Grade) => grade.grade !== 'All');
          const filteredGrades = data.filter(
            (grade: Grade) => grade.grade.toLowerCase() === this.getParam
          );
          if (filteredGrades.length > 0 && filteredGrades) {
            this.getGradeId = filteredGrades[0].id;
            this.studentForm.patchValue({
              grade: this.getGradeId,
            });
            this.isLoading = false;
          } else {
            this.isLoading = false;
            errorMessageDialog(`Grade not found!`);
            this.router.navigate([`student-dashboard`]);
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        showDialog(error);
        this.router.navigate([`student-dashboard`]);
      },
    });
    if (this.isUpdateMode) {
      this.isLoading = true;
      if (id.length > CONST.MAX_ID_LENGTH) {
        this.isLoading = false;
        const result = await expiredDialog(noResultFound);
        if (result.isConfirmed) {
          this.router.navigate([`students/${this.getParam}`]);
        } else {
          this.router.navigate([`students/${this.getParam}`]);
        }
      } else if (isNaN(id)) {
        this.isLoading = false;
        const result = await expiredDialog(noResultFound);
        if (result.isConfirmed) {
          this.router.navigate([`students/${this.getParam}`]);
        } else {
          this.router.navigate([`students/${this.getParam}`]);
        }
      } else {
        this.studentService.getStudentById(this.studentId).subscribe({
          next: (student: StudentData) => {
            this.guardianId = student.guardianInfo?.id;
            this.getGradeId = student.grade.id;
            this.studentForm.patchValue({
              name: student.name,
              grade: this.getGradeId,
              studentId: student.studentId,
              gender: student.gender,
              academicYear: student.academicYear.id,
              guardianName: student.guardianInfo?.guardianName,
              phNo: student.guardianInfo?.phNo,
              address: student.address,
            });
            this.isLoading = false;
          },
          error: (error) => {
            this.isLoading = false;
            showDialog(error);
            this.router.navigate([`students/${this.getParam}`]);
          },
        });
      }
    }
  }

  //Form Validation
  private setUpStudentForm(): void {
    this.studentIdValidator = this.studentIdValidator.bind(this);
    const gradeValue =
      this.getGradeId !== undefined && this.getParam === 'all'
        ? this.getGradeId
        : this.getGradeId;
    const isGradeDisabled = this.getParam !== 'all';

    const guardianNameValidators = [
      Validators.required,
      Validators.maxLength(CONST.MAX_USERNAME),
      Validators.minLength(CONST.MIN_USERNAME),
    ];

    if (!this.isUpdateMode && this.isChangeGuardianInfo) {
      guardianNameValidators.push(Validators.required);
    }

    const phNoValidators = [
      Validators.required,
      Validators.maxLength(CONST.MAX_STUDENT_ID),
      validatePhoneNumber,
    ];

    if (!this.isUpdateMode && this.isChangeGuardianInfo) {
      phNoValidators.push(Validators.required);
    }

    this.studentForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(CONST.MAX_USERNAME),
          Validators.minLength(CONST.MIN_USERNAME),
        ],
      ],
      grade: [
        {
          value: this.isUpdateMode ? null : gradeValue,
          disabled: isGradeDisabled,
        },
        Validators.required,
      ],
      studentId: [
        '',
        [
          Validators.required,
          Validators.minLength(CONST.MIN_STUDENT_ID),
          Validators.maxLength(CONST.MAX_STUDENT_ID),
          this.studentIdValidator,
        ],
      ],
      gender: ['', Validators.required],
      academicYear: [, Validators.required],

      address: [
        '',
        [
          Validators.required,
          Validators.maxLength(CONST.MAX_ADDRESS),
          Validators.minLength(CONST.MIN_ADDRESS),
        ],
      ],
      guardianName: ['', guardianNameValidators],
      phNo: ['', phNoValidators],
    });
  }

  public studentIdValidator(
    control: AbstractControl
  ): { [key: string]: any } | any {
    const selectedGrade = control.parent?.get('grade')?.value;
    const studentId = control.value;

    if (selectedGrade && studentId) {
      const grades = [...this.grades];
      const filterGrades = grades.filter((data) => data.id === selectedGrade);
      if (filterGrades[0].grade === 'KG') {
        if (!studentId.startsWith('G0')) {
          return { invalidStudentId: true };
        }
      } else {
        const expectedPrefix =
          'G' + (getGradeNumber(filterGrades[0].grade) || '');
        if (!studentId.startsWith(expectedPrefix)) {
          return { invalidStudentId: true };
        }
      }
    }
  }

  private gradeChanges() {
    this.studentForm.get('grade')?.valueChanges.subscribe(() => {
      this.studentForm.get('studentId')?.updateValueAndValidity();
    });
  }

  //Show or Hide to change Password
  changeGuardianInfoToggle() {
    this.isChangeGuardianInfo = !this.isChangeGuardianInfo;
  }

  /// get AcademicYear
  getSelectedAcademicYear(): string {
    const academicYearId = this.studentForm.get('academicYear')?.value;
    const selectedAcademicYear = this.academicYears.find(
      (academicYear) => academicYear.id === academicYearId
    );
    return selectedAcademicYear
      ? `${moment(selectedAcademicYear.startYear).year()} - ${moment(
          selectedAcademicYear.endYear
        ).year()}`
      : '';
  }

  formDisable() {
    this.studentForm.disable();
    this.showSubmit = true;
  }

  formEnable() {
    this.studentForm.enable();
    this.showSubmit = false;
  }

  //Submit
  studentSubmit() {
    this.studentForm.enable();
    this.showSubmit = false;
    let student = this.studentForm.value;
    if (this.isUpdateMode) {
      if (this.isChangeGuardianInfo) {
        this.studentService.updateStudent(
          student,
          this.getParam,
          this.studentId,
          this.guardianId
        );
      } else {
        const { guardianName, phNo, ...studentInfo } = student;
        this.studentService.updateStudent(
          studentInfo,
          this.getParam,
          this.studentId
        );
      }
    } else {
      this.studentService.createStudent(student, this.getParam);
    }
  }
}
