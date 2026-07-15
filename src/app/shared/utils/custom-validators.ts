import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

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

export function pastDateValidator(
  control: AbstractControl
): ValidationErrors | null {
  const inputDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(inputDate.getTime())) {
    return null;
  }

  inputDate.setHours(0, 0, 0, 0);

  return inputDate < today ? { pastDate: true } : null;
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

export function passwordMatchValidator(
  form: FormGroup
): ValidationErrors | null {
  const password = form.get('password');
  const confirmPassword = form.get('confirmPassword');

  if (
    !password ||
    !confirmPassword ||
    !password.value ||
    !confirmPassword.value
  ) {
    return null;
  }

  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ mismatch: true });
    return { mismatch: true };
  } else {
    if (confirmPassword.hasError('mismatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }
}

export function withinThreeWeeksValidator(
  control: AbstractControl
): ValidationErrors | null {
  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + 1);

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 21);

  if (isNaN(selectedDate.getTime())) {
    return null;
  }

  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate < minDate) {
    return { tooEarly: true };
  }

  if (selectedDate > maxDate) {
    return { outOfRange: true };
  }

  return null;
}

export function timeRangeValidator(group: AbstractControl): ValidationErrors | null {
  const startControl = group.get('startTime');
  const endControl = group.get('endTime');
  const date = group.get('date')?.value;
  const startTime = startControl?.value;
  const endTime = endControl?.value;

  if (!date || !startTime || !endTime || !startControl || !endControl) return null;

  const parse12hTime = (timeStr: string): { hours: number; minutes: number } | null => {
    const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
    const match = timeStr.match(timeRegex);

    if (!match) return null;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridian = match[3].toUpperCase();

    if (meridian === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (meridian === 'AM' && hours === 12) {
      hours = 0;
    }

    return { hours, minutes };
  };

  const combineDateTime = (dateStr: string, timeStr: string): Date | null => {
    const time = parse12hTime(timeStr);
    if (!time) return null;

    const dateObj = new Date(dateStr);
    dateObj.setHours(time.hours, time.minutes, 0, 0);
    return dateObj;
  };

  const startDateTime = combineDateTime(date, startTime);
  const endDateTime = combineDateTime(date, endTime);

  if (!startDateTime || !endDateTime) {
    return null;
  }

  if (startDateTime >= endDateTime) {
    endControl.setErrors({ ...(endControl.errors || {}), invalidTimeRange: true });
    return { invalidTimeRange: true };
  } else {
    if (endControl.hasError('invalidTimeRange')) {
      const errors = { ...endControl.errors };
      delete errors['invalidTimeRange'];
      endControl.setErrors(Object.keys(errors).length ? errors : null);
    }
    return null;
  }
}
