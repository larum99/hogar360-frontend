import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noOnlyWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value ?? '';
    return value.trim().length === 0 ? { onlyWhitespace: true } : null;
}
