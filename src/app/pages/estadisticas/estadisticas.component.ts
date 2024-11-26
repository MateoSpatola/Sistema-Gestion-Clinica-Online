import { Component } from '@angular/core';
import { LogIngresosComponent } from "../../components/log-ingresos/log-ingresos.component";

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [LogIngresosComponent],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {

  protected tabSeleccionado: string = '';

}
