import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noOnlyWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value ?? '';
  return value.trim().length === 0 ? { onlyWhitespace: true } : null;
}

export function isAdultValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const birthDate = new Date(value);
  if (isNaN(birthDate.getTime())) {
    return { notAdult: true };
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age >= 18 ? null : { notAdult: true };
}
