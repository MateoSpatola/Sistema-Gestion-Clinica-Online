import { Component, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent {
  private _databaseService = inject(DatabaseService);
  private _notificationService= inject(NotificationService);
  protected turnos: any[] = [];
  protected motivoCancelacion: string = '';

  ngOnInit() {
    this._databaseService.getDocument('turnos').subscribe(response => {
      this.turnos = [];
      response.forEach((res: any) => {
        res.fechaCompleta = this._databaseService.convertTimestampToDate(res.fechaCompleta);
        this.turnos.push(res);
      });
    })
  }

  async cancelarTurno(turnoId: string) {
    this._notificationService.showLoadingAlert('Cancelando turno...');
    try {
      await this._databaseService.updateDocument('turnos', { estado: 'Cancelado', detalleCancelacion: 'Cancelado por administración', motivoCancelacion: this.motivoCancelacion}, turnoId);
      this.motivoCancelacion = '';
      this._notificationService.closeAlert();
      this._notificationService.showAlert('¡Turno cancelado con exito!', 'success', 1000);
    } 
    catch (error: any) {
      this._notificationService.closeAlert();
      this._notificationService.showAlert('Error inesperado: ' + error.code, 'error', 2000);
    }
  }

}
