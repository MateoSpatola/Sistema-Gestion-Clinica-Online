import { Component, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { Turno } from '../../models/turno';
import { Usuario } from '../../models/usuario';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { HistoriaClinica } from '../../models/historiaClinica';
import { EstadoBadgeDirective } from '../../directives/estado-badge.directive';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatIconModule,
    EstadoBadgeDirective
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
  
  protected turnosFiltrados: Turno[] = [];
  protected filtro: string = '';

  protected historiaClinica!: HistoriaClinica;

  protected formHistoriaClinica = new FormGroup({
    altura: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(300)]),
    peso: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(300)]),
    temperatura: new FormControl(null, [Validators.required, Validators.min(35), Validators.max(45)]),
    presionSistolica: new FormControl(null, [Validators.required, Validators.min(50), Validators.max(250)]),
    presionDiastolica: new FormControl(null, [Validators.required, Validators.min(30), Validators.max(150)]),
    claveUno: new FormControl(),
    valorUno: new FormControl(),
    claveDos: new FormControl(),
    valorDos: new FormControl(),
    claveTres: new FormControl(),
    valorTres: new FormControl(),
  })

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
      this.turnosFiltrados = this.turnos;
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

  async generarHistoriaClinica() {
    if (this.formHistoriaClinica.valid) {
      
      const infoAdicional: { [clave: string]: string } = {};

      if (this.formHistoriaClinica.value.claveUno && this.formHistoriaClinica.value.valorUno) {
        infoAdicional[this.formHistoriaClinica.value.claveUno] = this.formHistoriaClinica.value.valorUno;
      }
      if (this.formHistoriaClinica.value.claveDos && this.formHistoriaClinica.value.valorDos) {
        infoAdicional[this.formHistoriaClinica.value.claveDos] = this.formHistoriaClinica.value.valorDos;
      }
      if (this.formHistoriaClinica.value.claveTres && this.formHistoriaClinica.value.valorTres) {
        infoAdicional[this.formHistoriaClinica.value.claveTres] = this.formHistoriaClinica.value.valorTres;
      }

      this.historiaClinica = {
        altura: this.formHistoriaClinica.value.altura ?? 0,
        peso: this.formHistoriaClinica.value.peso ?? 0,
        temperatura: this.formHistoriaClinica.value.temperatura ?? 0,
        presionSistolica: this.formHistoriaClinica.value.presionSistolica ?? 0,
        presionDiastolica: this.formHistoriaClinica.value.presionDiastolica ?? 0,
        datosDinamicos: infoAdicional,
      };
    }
    else {
      this._notificationService.showAlert('Historia clínica inválida', 'error', 2000);
    }
  }

  async finalizarTurno(turnoId: string) {
    this._notificationService.showLoadingAlert('Finalizando turno...');
    try {
      await this._databaseService.updateDocument('turnos', { estado: 'Realizado', historiaClinica: this.historiaClinica, resenia: this.resenia }, turnoId);

      this.resenia = '';
      this._notificationService.closeAlert();
      this._notificationService.showAlert('¡Turno finalizado con exito!', 'success', 1000);
    } 
    catch (error: any) {
      this._notificationService.closeAlert();
      this._notificationService.showAlert('Error inesperado: ' + error.code, 'error', 2000);
    }
  }

  filtrarTurnos() {
    if (!this.filtro) {
      this.turnosFiltrados = this.turnos;
    } else {
      const filtro = this.filtro.toLowerCase();
  
      this.turnosFiltrados = this.turnos.filter(turno => {
        const coincideConTurno = [
          turno.fechaCompleta.toLocaleString(),
          turno.correoEspecialista,
          turno.nombreEspecialista,
          turno.correoPaciente,
          turno.nombrePaciente,
          turno.especialidad,
          turno.estado,
          turno.motivoCancelacion,
          turno.motivoRechazo,
          turno.resenia,
          turno.encuesta,
          turno.calificacion
        ].some(campo => campo?.toLowerCase().includes(filtro));
  
        const historiaClinica = turno.historiaClinica;
        const coincideConHistoriaClinicaFijos = historiaClinica
          ? [
              historiaClinica.altura?.toString(),
              historiaClinica.peso?.toString(),
              historiaClinica.temperatura?.toString(),
              historiaClinica.presionSistolica?.toString(),
              historiaClinica.presionDiastolica?.toString()
            ].some(campo => campo?.toLowerCase().includes(filtro))
          : false;
  
        const coincideConHistoriaClinicaDinamicos = historiaClinica
          ? Object.values(historiaClinica.datosDinamicos || {}).some(valor =>
              valor.toLowerCase().includes(filtro)
            )
          : false;
  
        return coincideConTurno || coincideConHistoriaClinicaFijos || coincideConHistoriaClinicaDinamicos;
      });
    }
  }
}
