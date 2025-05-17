import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noOnlyWhitespaceValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value ?? '';
  return value.trim().length === 0 ? { onlyWhitespace: true } : null;
}

export function isAdultValidator(
  control: AbstractControl
): ValidationErrors | null {
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

export function maxOneMonthFromTodayValidator(
  control: AbstractControl
): ValidationErrors | null {
  const inputDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 1);
  maxDate.setHours(0, 0, 0, 0);

  if (isNaN(inputDate.getTime())) {
    return null;
  }

  inputDate.setHours(0, 0, 0, 0);

  if (inputDate < today) {
    return { pastDate: true };
  }

  if (inputDate > maxDate) {
    return { maxOneMonth: true };
  }

  return null;
}
