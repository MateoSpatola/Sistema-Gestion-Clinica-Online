import { Component, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import * as XLSX from 'xlsx';
import { LogIngreso } from '../../models/logIngreso';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-log-ingresos',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './log-ingresos.component.html',
  styleUrl: './log-ingresos.component.css'
})
export class LogIngresosComponent {

  private _databaseService = inject(DatabaseService);
  protected logIngresos: LogIngreso[] = [];

  ngOnInit() {
    this._databaseService.getDocument('log_ingresos').subscribe(response => {
      this.logIngresos = [];
      response.forEach((res: any) => {
        res.fechaIngreso = this._databaseService.convertTimestampToDate(res.fechaIngreso);
        this.logIngresos.push(res);
      });
    })
  }

  descargarExcelLogIngresos() {
    const log = this.logIngresos.map(log => ({
        Tipo: log.tipoUsuario,
        Nombre: log.nombreCompletoUsuario,
        Fecha: log.fechaIngreso.toLocaleString()
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(log);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Log Ingresos');

    XLSX.writeFile(wb, 'log-ingresos.xlsx');
  }

}
