import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { VisitService } from 'src/app/core/services/visit.service';
import { HouseService } from 'src/app/core/services/house.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpStatusCode } from '@angular/common/http';
import { Visit } from 'src/app/shared/models/visit.model';
import { ApiResponse } from 'src/app/shared/models/api-response.model';
import { HouseList } from 'src/app/shared/models/house-list.model';
import { SelectOption } from 'src/app/shared/models/select-option.model';
import { withinThreeWeeksValidator } from 'src/app/shared/utils/custom-validators';

@Component({
  selector: 'app-create-visit-form',
  templateUrl: './create-visit-form.component.html',
  styleUrls: ['./create-visit-form.component.scss'],
})
export class CreateVisitFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly visitService = inject(VisitService);
  private readonly houseService = inject(HouseService);
  private readonly authService = inject(AuthService);

  visitForm!: FormGroup<{
    houseId: FormControl<number | null>;
    date: FormControl<string | null>;
    startTime: FormControl<string | null>;
    endTime: FormControl<string | null>;
  }>;

  housesOptions: SelectOption[] = [];

  ngOnInit(): void {
    this.visitForm = this.formBuilder.group({
      houseId: this.formBuilder.control<number | null>(null, [
        Validators.required,
      ]),
      date: this.formBuilder.control<string | null>(null, [
        Validators.required,
        withinThreeWeeksValidator,
      ]),
      startTime: this.formBuilder.control<string | null>(null, [
        Validators.required,
      ]),
      endTime: this.formBuilder.control<string | null>(null, [
        Validators.required,
      ]),
    });

    const publisherId = this.authService.getUserId();
    if (publisherId) {
      this.loadHouses(publisherId);
    } else {
      this.toastr.error('No se pudo obtener el usuario autenticado.', 'Error');
    }
  }

  loadHouses(publisherId: number): void {
    this.houseService.listHousesByPublisher(publisherId).subscribe({
      next: (houses) => {
        this.housesOptions = houses.map((house: HouseList) => ({
          value: house.id,
          label: house.name,
        }));
      },
      error: () => {
        this.toastr.error('No se pudieron cargar las casas.', 'Error');
      },
    });
  }

  onSubmit(): void {
    if (this.visitForm.invalid) {
      this.visitForm.markAllAsTouched();
      this.toastr.warning(
        'Por favor completa todos los campos requeridos.',
        'Formulario inválido'
      );
      return;
    }

    let { houseId, date, startTime, endTime } = this.visitForm.getRawValue();
    houseId = Number(houseId);

    function combineDateTime(dateStr: string, timeStr: string): Date {
      const [time, meridian] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      if (meridian === 'PM' && hours < 12) hours += 12;
      if (meridian === 'AM' && hours === 12) hours = 0;

      const date = new Date(dateStr);
      date.setHours(hours, minutes, 0, 0);
      return date;
    }

    function formatDateTimeLocal(date: Date): string {
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
      )}`;
    }

    const startDateTime = formatDateTimeLocal(
      combineDateTime(date!, startTime!)
    );
    const endDateTime = formatDateTimeLocal(combineDateTime(date!, endTime!));

    const visit: Visit = {
      houseId,
      startDateTime,
      endDateTime,
    };

    this.visitService.createVisit(visit).subscribe({
      next: (response: ApiResponse) => {
        this.toastr.success('Visita registrada exitosamente.', 'Éxito');
        this.visitForm.reset();
      },
      error: (error) => {
        const serverMessage = error?.error?.message ?? error?.error?.mensaje;
        if (serverMessage?.includes('overlaps with the requested time')) {
          this.toastr.error(
            'Ya existe una visita programada para esa casa en ese horario.',
            'Conflicto de horario'
          );
          return;
        }
        if (error.status === HttpStatusCode.Conflict) {
          this.toastr.error(
            serverMessage ?? 'Conflicto al registrar la visita.',
            'Error'
          );
        } else {
          console.error('Error al registrar visita:', error);
          this.toastr.error('Error inesperado del servidor.', 'Error');
        }
      },
    });
  }
}
