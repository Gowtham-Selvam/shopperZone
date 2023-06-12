import { FormControl, ValidationErrors } from '@angular/forms';

export class CustomFormValidators {
  static onlySpaceError(control: FormControl): ValidationErrors {
    if (control.value !== null && control.value?.trim().length === 0)
      return { onlyWhiteSpace: true };
    else return null;
  }
}
