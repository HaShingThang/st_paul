import { Component } from '@angular/core';
import {
  AbstractControlOptions,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CONST, REGX } from 'src/app/constants/constants';
import { noResultFound } from 'src/app/constants/messages';
import { Grade, TeacherData } from 'src/app/interfaces/interfaces';
import { GradeService } from 'src/app/services/grade/grade.service';
import { TeacherService } from 'src/app/services/teacher/teacher.service';
import { expiredDialog } from 'src/app/utils/alert-dialog';
import { showDialog } from 'src/app/utils/functions';
import {
  validatePhoneNumber,
  passwordMatchValidator,
} from 'src/app/utils/validators';

@Component({
  selector: 'app-teacher-add-edit',
  templateUrl: './teacher-add-edit.component.html',
  styleUrls: ['./teacher-add-edit.component.scss'],
})
export class TeacherAddEditComponent {
  teacherForm!: FormGroup;
  changePasswordForm!: FormGroup;
  createUpdateTeacherForm!: FormGroup;
  teacherId!: number;
  hide = true;
  newPassHide = true;
  confirmPassHide = true;
  isUpdateMode = false;
  isLoading = false;
  showSubmit = false;
  isChangePassword = false;
  errorMessage = '';

  grades!: Grade[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public teacherService: TeacherService,
    private gradeService: GradeService
  ) {
    this.gradeService.grades.subscribe((data: Grade[]) => {
      this.grades = data.filter((grade: Grade) => grade.grade !== 'All');
    });
  }

  async ngOnInit(): Promise<void> {
    const { id } = this.route.snapshot.params;
    this.teacherId = +id;
    this.isUpdateMode = !!id;
    this.setUpteacherForm();
    this.setupChangePasswordForm();
    this.createUpdateTeacherForm = this.fb.group({
      teacher: this.teacherForm,
      changePassword: this.isUpdateMode && this.changePasswordForm,
    });
    if (this.isUpdateMode) {
      this.isLoading = true;
      if (id.length > CONST.MAX_ID_LENGTH) {
        this.isLoading = false;
        const result = await expiredDialog(noResultFound);
        if (result.isConfirmed) {
          this.router.navigate(['/teacher-list']);
        } else {
          this.router.navigate(['/teacher-list']);
        }
      } else if (isNaN(id)) {
        this.isLoading = false;
        const result = await expiredDialog(noResultFound);
        if (result.isConfirmed) {
          this.router.navigate(['/teacher-list']);
        } else {
          this.router.navigate(['/teacher-list']);
        }
      } else {
        this.teacherService.getTeacherById(this.teacherId).subscribe({
          next: (teacher: TeacherData) => {
            this.teacherForm.patchValue({
              username: teacher.username,
              email: teacher.email,
              grades: teacher.grades.map((grade: any) => grade.id),
              address: teacher.address ?? "",
              phNo: teacher.phNo ?? "",
              role: teacher.role.name,
            });
            this.isLoading = false;
          },
          error: (error) => {
            this.isLoading = false;
            showDialog(error);
            this.router.navigate(['/teacher-list']);
          },
        });
      }
    }
  }

  //Form Validation
  private setUpteacherForm(): void {
    this.teacherForm = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.maxLength(CONST.MAX_USERNAME),
            Validators.minLength(CONST.MIN_USERNAME),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.maxLength(CONST.MAX_EMAIL),
            Validators.pattern(REGX.EMAIL),
          ],
        ],
        password: [
          '',
          !this.isUpdateMode && [
            Validators.required,
            Validators.minLength(CONST.MIN_PASSWORD_LENGTH),
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(CONST.MIN_PASSWORD_LENGTH),
          ],
        ],
        grades: [[], [Validators.required]],
        address: [''],
        phNo: ['', [validatePhoneNumber]],
      },
      { validators: passwordMatchValidator } as AbstractControlOptions
    );
  }

  //Change Password Form Validation
  private setupChangePasswordForm(): void {
    if (this.isUpdateMode) {
      this.changePasswordForm = this.fb.group(
        {
          currentPassword: ['', [Validators.required]],
          password: [
            '',
            [
              Validators.required,
              Validators.minLength(CONST.MIN_PASSWORD_LENGTH),
            ],
          ],
          confirmPassword: [
            '',
            [
              Validators.required,
              Validators.minLength(CONST.MIN_PASSWORD_LENGTH),
            ],
          ],
        },
        { validators: passwordMatchValidator } as AbstractControlOptions
      );
    }
  }

  //Show or Hide to change Password
  changePasswordToggle() {
    this.isChangePassword = !this.isChangePassword;
  }

  formDisable() {
    this.teacherForm.disable();
    this.showSubmit = true;
  }

  formEnable() {
    this.teacherForm.enable();
    this.showSubmit = false;
  }

  //Submit
  teacherSubmit() {
    let teacher: any;
    this.teacherForm.enable();
    this.showSubmit = false;
    const { username, email, password, grades, address, phNo } =
      this.teacherForm.value;
    if (this.isUpdateMode) {
      teacher = { username, email, grades, address, phNo, role: 3 };
      if (this.isChangePassword) {
        const { changePassword } = this.createUpdateTeacherForm.value;
        if (changePassword && changePassword.password) {
          teacher = {
            ...teacher,
            currentPassword: changePassword.currentPassword,
            newPassword: changePassword.password,
          };
        }
      }
      this.teacherService.updateTeacher(this.teacherId, teacher);
    } else {
      teacher = { username, email, password, grades, address, phNo, role: 3 };
      this.teacherService.createTeacher(teacher);
    }
  }
}
