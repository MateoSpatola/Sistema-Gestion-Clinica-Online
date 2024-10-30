import { Component } from '@angular/core';
import { FormRegistroComponent } from "../../../components/form-registro/form-registro.component";

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormRegistroComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  tipoUsuarioSeleccionado: string | null = null;

  seleccionarTipoUsuario(tipo: string) {
    this.tipoUsuarioSeleccionado = tipo;
  }
}
