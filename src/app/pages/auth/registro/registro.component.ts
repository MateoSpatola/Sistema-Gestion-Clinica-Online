import { Component, inject } from '@angular/core';
import { FormRegistroComponent } from "../../../components/form-registro/form-registro.component";
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormRegistroComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  private _authService = inject(AuthService);

  protected tipoUsuarioSeleccionado?: "Paciente" | "Especialista" | "Administrador";
  protected adminAutenticado: boolean = false;

  ngOnInit(): void {
    if (this._authService.auth.currentUser?.displayName == 'Administrador') {
      this.adminAutenticado = true;
    }
  }

  seleccionarTipoUsuario(tipo: "Paciente" | "Especialista" | "Administrador") {
    this.tipoUsuarioSeleccionado = tipo;
  }
}
