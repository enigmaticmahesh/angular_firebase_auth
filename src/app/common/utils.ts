import {
    AbstractControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators
  } from '@angular/forms';

export function confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const confirmPassword = control.value;
    const password = control.parent?.get('password')?.value

      if (!confirmPassword) {
        return null;
      }
      return password === confirmPassword
        ? null
        : { passwordMismatch: true };
    };
}

export const REGISTRATION_CONTROLS = [
    {
      controlName: 'confirmPassword',
      validators: [Validators.required, confirmPasswordValidator()],
      placeHolder: 'Confirm Password',
    },
    {
      controlName: 'name',
      validators: [Validators.required],
      placeHolder: 'Your Full Name',
    },
    {
      controlName: 'mobile',
      validators: [Validators.required],
      placeHolder: 'Your Mobile Number',
    },
  ];