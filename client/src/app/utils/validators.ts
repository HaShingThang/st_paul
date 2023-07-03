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
    return null;
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
