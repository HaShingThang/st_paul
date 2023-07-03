import { Component, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CONST, ROLES } from '../../../constants/constants';
import { REGX } from 'src/app/constants/constants';
import {
  passwordMatchValidator,
  validatePhoneNumber,
} from 'src/app/utils/validators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AdminService } from 'src/app/services/admin/admin.service';
import { showDialog } from 'src/app/utils/functions';
import { noResultFound } from 'src/app/constants/messages';
import { expiredDialog } from 'src/app/utils/alert-dialog';
import { AdminData } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-admin-add-edit',
  templateUrl: './admin-add-edit.component.html',
  styleUrls: ['./admin-add-edit.component.scss'],
})
export class AdminAddEditComponent implements OnInit {
  adminForm!: FormGroup;
  changePasswordForm!: FormGroup;
  createUpdateAdminForm!: FormGroup;
  adminId!: number;
  hide = true;
  newPassHide = true;
  confirmPassHide = true;
  isUpdateMode = false;
  isLoading = false;
  showSubmit = false;
  isChangePassword = false;
  errorMessage = '';
  editAccount = 'Edit Admin Account';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    public adminService: AdminService
  ) {}

  async ngOnInit(): Promise<void> {
    const { id } = this.route.snapshot.params;
    const myID = this.authService.getID();
    this.adminId = +id;
    this.isUpdateMode = !!id;
    this.setUpAdminForm();
    this.setupChangePasswordForm();
    this.createUpdateAdminForm = this.fb.group({
      admin: this.adminForm,
      changePassword: this.isUpdateMode && this.changePasswordForm,
    });
    if (this.isUpdateMode) {
      if (myID === this.adminId) {
        this.editAccount = 'Edit My Account';
      }
      this.isLoading = true;
      if (id.length > CONST.MAX_ID_LENGTH) {
        this.isLoading = false;
        const result = await expiredDialog(noResultFound);
        if (result.isConfirmed) {
          this.router.navigate(['/admin-list']);
        } else {
          this.router.navigate(['/admin-list']);
        }
      } else if (isNaN(id)) {
        this.isLoading = false;
        const result = await expiredDialog(noResultFound);
        if (result.isConfirmed) {
          this.router.navigate(['/admin-list']);
        } else {
          this.router.navigate(['/admin-list']);
        }
      } else {
        this.adminService.getAdminById(this.adminId).subscribe({
          next: (admin: AdminData) => {
            this.adminForm.patchValue({
              username: admin.username,
              email: admin.email,
              phNo: admin.phNo,
              role: admin.role.name,
            });
            this.isLoading = false;
          },
          error: (error) => {
            this.isLoading = false;
            showDialog(error);
            this.router.navigate(['/admin-list']);
          },
        });
      }
    }
  }

  //Form Validation
  private setUpAdminForm(): void {
    this.adminForm = this.fb.group(
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
        phNo: ['', [validatePhoneNumber]],
        role: ['Admin', Validators.required],
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
    this.adminForm.disable();
    this.showSubmit = true;
  }

  formEnable() {
    this.adminForm.enable();
    this.showSubmit = false;
  }

  //Submit
  adminSubmit() {
    let admin: any;
    this.adminForm.enable();
    this.showSubmit = false;
    const { username, email, password, phNo, role } = this.adminForm.value;
    if (this.isUpdateMode) {
      if (role === ROLES.SUPER_ADMIN) {
        admin = { username, email, phNo, role: 1 };
      } else if (role === ROLES.ADMIN) {
        admin = { username, email, phNo, role: 2 };
      }
      if (this.isChangePassword) {
        const { changePassword } = this.createUpdateAdminForm.value;
        if (changePassword && changePassword.password) {
          admin = {
            ...admin,
            currentPassword: changePassword.currentPassword,
            newPassword: changePassword.password,
          };
        }
      }
      this.adminService.updateAdmin(this.adminId, admin);
    } else {
      if (role === ROLES.SUPER_ADMIN) {
        admin = { username, email, password, phNo, role: 1 };
      } else if (role === ROLES.ADMIN) {
        admin = { username, email, password, phNo, role: 2 };
      }
      this.adminService.createAdmin(admin);
    }
  }
}
