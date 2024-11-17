import { Component, inject, Input } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { DatabaseService } from '../../services/database.service';
import { Turno } from '../../models/turno';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.css'
})
export class HistoriaClinicaComponent {
  @Input() usuario?: Usuario;
  @Input() verResenia: boolean = false;

  private _databaseService = inject(DatabaseService);
  objectKeys = Object.keys;

  protected turnosConHistoriaClinica: Turno[] = [];

  ngOnInit(): void {

    this._databaseService.getDocument('turnos').subscribe(response => {
      response.forEach((res: any) => {
        if(res.historiaClinica) {
          if(this.usuario?.correo == res.correoPaciente || this.usuario?.correo == res.correoEspecialista) {
            res.fechaCompleta = this._databaseService.convertTimestampToDate(res.fechaCompleta);
            this.turnosConHistoriaClinica.push(res);
          }
        }
      });
      console.log(this.turnosConHistoriaClinica);
    });
  }

}
