import { Component, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { NgClass } from '@angular/common';
import { Turno } from '../../models/turno';
import { Usuario } from '../../models/usuario';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.css'
})
export class MisTurnosComponent {
  private _authService = inject(AuthService);
  private _databaseService = inject(DatabaseService);
  private _notificationService= inject(NotificationService);

  protected infoUsuario?: Usuario;

  protected turnos: Turno[] = [];
  protected motivoCancelacion: string = '';
  protected encuesta: string = '';
  protected calificacion: string = '';
  protected motivoRechazo: string = '';
  protected resenia: string = '';

  async ngOnInit() {

    let user = this._authService.auth.currentUser;
    if (user) {
      this.infoUsuario = await this._databaseService.getDocumentById('usuarios', user.email!);
    }

    this._databaseService.getDocument('turnos').subscribe(response => {
      this.turnos = [];
      response.forEach((res: any) => {
        if(res.correoPaciente == this.infoUsuario?.correo || res.correoEspecialista == this.infoUsuario?.correo) {
          res.fechaCompleta = this._databaseService.convertTimestampToDate(res.fechaCompleta);
          this.turnos.push(res);
        }
      });
    })
  }

  async enviarEncuesta(turnoId: string) {
    this._notificationService.showLoadingAlert('Enviando encuesta...');
    try {
      await this._databaseService.updateDocument('turnos', { encuesta: this.encuesta}, turnoId);
      this.encuesta = '';
      this._notificationService.closeAlert();
      this._notificationService.showAlert('¡Encuesta enviada con exito!', 'success', 1000);
    } 
    catch (error: any) {
      this._notificationService.closeAlert();
      this._notificationService.showAlert('Error inesperado: ' + error.code, 'error', 2000);
    }
  }

  async enviarCalificacion(turnoId: string) {
    this._notificationService.showLoadingAlert('Enviando calificación...');
    try {
      await this._databaseService.updateDocument('turnos', { calificacion: this.calificacion}, turnoId);
      this.calificacion = '';
      this._notificationService.closeAlert();
      this._notificationService.showAlert('Calificación enviada con exito!', 'success', 1000);
    } 
    catch (error: any) {
      this._notificationService.closeAlert();
      this._notificationService.showAlert('Error inesperado: ' + error.code, 'error', 2000);
    }
  }

  async cancelarTurno(turnoId: string) {
    this._notificationService.showLoadingAlert('Cancelando turno...');
    try {
      await this._databaseService.updateDocument('turnos', { estado: 'Cancelado', canceladoPor: this.infoUsuario?.tipo, motivoCancelacion: this.motivoCancelacion}, turnoId);
      this.motivoCancelacion = '';
      this._notificationService.closeAlert();
      this._notificationService.showAlert('¡Turno cancelado con exito!', 'success', 1000);
    } 
    catch (error: any) {
      this._notificationService.closeAlert();
      this._notificationService.showAlert('Error inesperado: ' + error.code, 'error', 2000);
    }
  }

  async rechazarTurno(turnoId: string) {
    this._notificationService.showLoadingAlert('Rechazando turno...');
    try {
      await this._databaseService.updateDocument('turnos', { estado: 'Rechazado', canceladoPor: this.infoUsuario?.tipo, motivoRechazo: this.motivoRechazo}, turnoId);
      this.motivoRechazo = '';
      this._notificationService.closeAlert();
      this._notificationService.showAlert('¡Turno rechazado con exito!', 'success', 1000);
    } 
    catch (error: any) {
      this._notificationService.closeAlert();
      this._notificationService.showAlert('Error inesperado: ' + error.code, 'error', 2000);
    }
  }

  async aceptarTurno(turnoId: string) {
    this._notificationService.showLoadingAlert('Aceptando turno...');
    try {
      await this._databaseService.updateDocument('turnos', { estado: 'Aceptado'}, turnoId);
      this._notificationService.closeAlert();
      this._notificationService.showAlert('¡Turno aceptado con exito!', 'success', 1000);
    } 
    catch (error: any) {
      this._notificationService.closeAlert();
      this._notificationService.showAlert('Error inesperado: ' + error.code, 'error', 2000);
    }
  }

  async finalizarTurno(turnoId: string) {
    this._notificationService.showLoadingAlert('Finalizando turno...');
    try {
      await this._databaseService.updateDocument('turnos', { estado: 'Realizado', resenia: this.resenia}, turnoId);
      this.resenia = '';
      this._notificationService.closeAlert();
      this._notificationService.showAlert('¡Turno finalizado con exito!', 'success', 1000);
    } 
    catch (error: any) {
      this._notificationService.closeAlert();
      this._notificationService.showAlert('Error inesperado: ' + error.code, 'error', 2000);
    }
  }
}
