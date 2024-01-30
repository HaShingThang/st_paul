import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

//Password Confirmation
export function passwordMatchValidator(control: FormGroup) {
  const password = control.get('password');
  const cpassword = control.get('confirmPassword');
  if (password && cpassword && password.value !== cpassword.value) {
    cpassword.setErrors({ passwordMismatch: true });
  } else {
    cpassword!.setErrors(null);
  }
}

//Phone Number Validator
export function validatePhoneNumber(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;
  if (!value) {
    return { required: true };
  } else if (!/^\d+$/.test(value)) {
    return { invalidNumber: true };
  } else if (!/^09/.test(value)) {
    return { invalidStart: true };
  } else if (value.length < 8) {
    return { minlength: true };
  } else if (value.length > 11) {
    return { maxlength: true };
  }
  return null;
}

export const DATE_YEAR_FORMAT = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

export const DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const TIME_FORMAT = {
  parse: {
    timeInput: 'hh:mm A',
  },
  display: {
    timeInput: 'hh:mm A',
    hourMinuteLabel: 'HH:mm',
    hourMinuteA11yLabel: 'HH:mm',
  },
};

export function getGradeNumber(grade: string): number | null {
  const match = grade.match(/\d+$/);
  return match ? parseInt(match[0], 10) : null;
}
