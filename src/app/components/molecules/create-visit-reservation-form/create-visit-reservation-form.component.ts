import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { VisitReservation } from 'src/app/shared/models/visit-reservation.model';
import { VisitList } from 'src/app/shared/models/visit-list.model';
import { SelectOption } from 'src/app/shared/models/select-option.model';
import { VisitService } from 'src/app/core/services/visit.service';

@Component({
  selector: 'app-create-visit-reservation-form',
  templateUrl: './create-visit-reservation-form.component.html',
  styleUrls: ['./create-visit-reservation-form.component.scss'],
})
export class CreateVisitReservationFormComponent implements OnChanges {
  @Input() visits: VisitList[] | null = [];
  @Output() reserved = new EventEmitter<void>();

  visitOptions: SelectOption[] = [];
  hasVisits: boolean = false;

  private readonly formBuilder = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly visitService = inject(VisitService);

  reservationForm: FormGroup<{
    visitId: FormControl<number | null>;
    buyerEmail: FormControl<string | null>;
  }> = this.formBuilder.group({
    visitId: this.formBuilder.control<number | null>(null, [Validators.required]),
    buyerEmail: this.formBuilder.control<string | null>('', [
      Validators.required,
      Validators.email,
    ]),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visits']) {
      this.visitOptions = (this.visits ?? []).map((visit) => ({
        value: visit.id,
        label: `${new Date(visit.startDateTime).toLocaleString()} - ${new Date(visit.endDateTime).toLocaleString()}`
      }));

      this.hasVisits = this.visitOptions.length > 0;

      if (this.hasVisits) {
        this.reservationForm.patchValue({ visitId: this.visitOptions[0].value as number });
      } else {
        this.reservationForm.patchValue({ visitId: null });
      }
    }
  }

  onSubmit(): void {
    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
      this.toastr.warning(
        'Completa todos los campos correctamente.',
        'Formulario inválido'
      );
      return;
    }

    const { visitId, buyerEmail } = this.reservationForm.getRawValue();

    const payload: VisitReservation = {
      visitId: visitId!,
      buyerEmail: buyerEmail!.trim(),
    };

    this.visitService.reserveVisit(payload).subscribe({
      next: () => {
        this.toastr.success('Reserva realizada con éxito.', '¡Éxito!');
        this.reservationForm.reset();
        this.reserved.emit();
      },
      error: (error) => {
        const message =
          error?.error?.message ?? 'Ocurrió un error al reservar.';
        this.toastr.error(message, 'Error');
      },
    });
  }
}
