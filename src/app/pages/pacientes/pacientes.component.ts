import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { Usuario } from '../../models/usuario';
import { Turno } from '../../models/turno';
import { HistoriaClinicaComponent } from "../../components/historia-clinica/historia-clinica.component";

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [HistoriaClinicaComponent],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent {

  private _authService = inject(AuthService);
  private _databaseService = inject(DatabaseService);

  protected infoUsuario?: Usuario;
  protected turnosRealizadosEspecialista: Turno[] = [];
  protected pacientesUnicosAtendidos: Usuario[] = [];
  protected pacienteSeleccionado!: Usuario;
  protected verHistoriaClinica: boolean = false;


  async ngOnInit() {
    let user = this._authService.auth.currentUser;
    if (user) {
      this.infoUsuario = await this._databaseService.getDocumentById('usuarios', user.email!);
    }

    this._databaseService.getDocument('turnos').subscribe(response => {
      this.turnosRealizadosEspecialista = [];
      response.forEach((res: any) => {
        if(res.estado == 'Realizado') {
          if(res.correoEspecialista == this.infoUsuario?.correo) {
            res.fechaCompleta = this._databaseService.convertTimestampToDate(res.fechaCompleta);
            this.turnosRealizadosEspecialista.push(res);
          }
        }
      });

      this._databaseService.getDocument('usuarios').subscribe(response => {
        this.pacientesUnicosAtendidos = [];
        response.forEach((res: any) => {
          if(res.tipo == 'Paciente' && this.turnosRealizadosEspecialista.some(turno => turno.correoPaciente === res.correo)) {
            this.pacientesUnicosAtendidos.push(res);
          }
        });
      })

    })
  }

  seleccionarPaciente(paciente: Usuario) {
    this.pacienteSeleccionado = paciente;
    this.verHistoriaClinica = true;
  }


}
