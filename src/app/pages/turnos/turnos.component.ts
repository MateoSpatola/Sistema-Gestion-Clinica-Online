import { Component, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Turno } from '../../models/turno';
import { EstadoBadgeDirective } from '../../directives/estado-badge.directive';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    EstadoBadgeDirective
  ],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent {
  private _databaseService = inject(DatabaseService);
  private _notificationService= inject(NotificationService);
  protected turnos: Turno[] = [];
  protected motivoCancelacion: string = '';

  protected turnosFiltrados: Turno[] = [];
  protected filtro: string = '';

  ngOnInit() {
    this._databaseService.getDocument('turnos').subscribe(response => {
      this.turnos = [];
      response.forEach((res: any) => {
        res.fechaCompleta = this._databaseService.convertTimestampToDate(res.fechaCompleta);
        this.turnos.push(res);
      });
      this.turnosFiltrados = this.turnos;
    })
  }

  async cancelarTurno(turnoId: string) {
    this._notificationService.showLoadingAlert('Cancelando turno...');
    try {
      await this._databaseService.updateDocument('turnos', { estado: 'Cancelado', canceladoPor: 'Administración', motivoCancelacion: this.motivoCancelacion}, turnoId);
      this.motivoCancelacion = '';
      this._notificationService.closeAlert();
      this._notificationService.showAlert('¡Turno cancelado con exito!', 'success', 1000);
    } 
    catch (error: any) {
      this._notificationService.closeAlert();
      this._notificationService.showAlert('Error inesperado: ' + error.code, 'error', 2000);
    }
  }

  filtrarTurnos() {
    if (!this.filtro) {
      this.turnosFiltrados = this.turnos;
    }
    else {
      this.filtro.toLowerCase();
      this.turnosFiltrados = this.turnos.filter(turno =>
        turno.especialidad.toLowerCase().includes(this.filtro) ||
        turno.nombreEspecialista.toLowerCase().includes(this.filtro)||
        turno.nombrePaciente.toLowerCase().includes(this.filtro)
      );
    }
  }

}
