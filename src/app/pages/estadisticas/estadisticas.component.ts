import { Component } from '@angular/core';
import { LogIngresosComponent } from "../../components/log-ingresos/log-ingresos.component";
import { TurnosPorEspecialidadComponent } from "../../components/turnos-por-especialidad/turnos-por-especialidad.component";
import { TurnosPorDiaComponent } from "../../components/turnos-por-dia/turnos-por-dia.component";

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [LogIngresosComponent, TurnosPorEspecialidadComponent, TurnosPorDiaComponent],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {

  protected tabSeleccionado: string = '';

}
