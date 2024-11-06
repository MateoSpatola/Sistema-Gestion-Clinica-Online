import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  private _authService = inject(AuthService);
  private _databaseService = inject(DatabaseService);
  private _notificationService= inject(NotificationService);

  infoUsuario: any;
  modificarHorarios: boolean = false;

  dias: any[] = [
    { dia: 'Lunes', trabaja: false, inicio: '', fin: '' },
    { dia: 'Martes', trabaja: false, inicio: '', fin: '' },
    { dia: 'Miércoles', trabaja: false, inicio: '', fin: '' },
    { dia: 'Jueves', trabaja: false, inicio: '', fin: '' },
    { dia: 'Viernes', trabaja: false, inicio: '', fin: '' },
    { dia: 'Sábado', trabaja: false, inicio: '', fin: '' }
  ];

  async ngOnInit() {
    let user = this._authService.auth.currentUser;
    if (user) {
      this.infoUsuario = await this._databaseService.getDocumentById('usuarios', user.email!);
      if(this.infoUsuario.disponibilidad) {
        this.dias = this.infoUsuario.disponibilidad;
      }
    }
  }

  obtenerOpcionesDeHorario(dia: any, esInicio: boolean, inicioSeleccionado?: string): string[] {
    let inicio = 8;
    let fin = dia.nombre == 'Sábado' ? 14 : 19;
    const opciones: string[] = [];

    for (let hora = inicio; hora <= fin; hora++) {
      opciones.push(`${hora}:00`);
      if (hora != fin) {
        opciones.push(`${hora}:30`);
      }
    }

    if (esInicio) {
      return opciones.slice(0, -1);
    } 
    else if (inicioSeleccionado) {
      const index = opciones.indexOf(inicioSeleccionado);
      return opciones.slice(index + 1);
    }

    return opciones;
  }

  cambiarDisponibilidad(dia: any) {
    dia.inicio = '';
    dia.fin = '';
  }

  actualizarFin(dia: any) {
    dia.fin = '';
  }

  esFormularioValido(): boolean {
    return this.dias.every(dia => {
      if (dia.trabaja) {
        return dia.inicio && dia.fin;
      }
      return true;
    });
  }

  async guardarHorarios() {
    if (this.esFormularioValido()) {
      this._notificationService.showLoadingAlert('Guardando horarios...');
      try {
        await this._databaseService.updateDocument('usuarios', { disponibilidad: this.dias }, this.infoUsuario.correo);
        this._notificationService.closeAlert();
        this._notificationService.showAlert('¡Horarios guardados con exito!', 'success', 2000);
        this.modificarHorarios = false;
      } 
      catch (error: any) {
        this._notificationService.closeAlert();
        this._notificationService.showAlert('Error inesperado: ' + error.code, 'error', 2000);
      }
    } 
    else {
      this._notificationService.showAlert('Por favor, complete todos los horarios habilitados antes de guardar.', 'error', 2000);
    }
  }


}
