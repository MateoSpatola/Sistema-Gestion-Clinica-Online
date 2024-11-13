import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { NotificationService } from '../../services/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuario';
import { Dia } from '../../models/dia';
import { Turno } from '../../models/turno';
import { Especialidad } from '../../models/especialidad';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent {

  private _authService = inject(AuthService);
  private _databaseService = inject(DatabaseService);
  private _notificationService= inject(NotificationService);

  protected infoUsuario?: Usuario;

  protected pacientes: Usuario[] = [];
  protected especialidades: Especialidad[] = [];
  protected especialistas: Usuario[] = [];
  protected especialistasDisponibles: Usuario[] = [];
  protected fechasDisponibles: Date[] = [];
  protected horariosDisponibles: { horario: Date, disponible: boolean }[] = [];
  protected turnos: Turno[] = [];

  protected pacienteSeleccionado?: Usuario;
  protected especialidadSeleccionada?: Especialidad;
  protected especialistaSeleccionado?: Usuario;
  protected fechaSeleccionada?: Date;
  protected fechaYHorarioSeleccionado?: Date;


  async ngOnInit() {
    let user = this._authService.auth.currentUser;
    if (user) {
      this.infoUsuario = await this._databaseService.getDocumentById('usuarios', user.email!);
    }

    this._databaseService.getDocument('usuarios').subscribe(response => {
      this.especialistas = [];
      response.forEach((res: any) => {
        if(res.tipo == 'Especialista') {
          this.especialistas.push(res);
        }
        else if (res.tipo == 'Paciente') {
          if (this.infoUsuario?.tipo == 'Paciente') {
            if (res.correo == this.infoUsuario?.correo) {
              this.pacienteSeleccionado = res;
            }
          }
          else {
            this.pacientes.push(res);
          }
        }
      });
    });


    this._databaseService.getDocument('especialidades').subscribe(response => {
      response.forEach((res: any) => {
        this.especialidades.push(res);
      });
    });

    this._databaseService.getDocument('turnos').subscribe(response => {
      response.forEach((res: any) => {
        console.log(res.fechaCompleta);
        res.fechaCompleta = this._databaseService.convertTimestampToDate(res.fechaCompleta);
        this.turnos.push(res);
        console.log(res.fechaCompleta);
      });
    });
  }


  seleccionarPaciente(paciente: Usuario) {
    this.especialidadSeleccionada = undefined;
    this.especialistaSeleccionado = undefined;
    this.especialistasDisponibles = [];
    this.fechaSeleccionada = undefined;
    this.fechasDisponibles = [];
    this.fechaYHorarioSeleccionado = undefined;
    this.horariosDisponibles = [];
    this.pacienteSeleccionado = paciente;
  }

  seleccionarEspecialidad(especialidad: Especialidad) {
    this.especialidadSeleccionada = especialidad;
    this.cargarEspecialistasDisponibles();
  }

  cargarEspecialistasDisponibles() {
    this.especialistaSeleccionado = undefined;
    this.especialistasDisponibles = [];
    this.fechaSeleccionada = undefined;
    this.fechasDisponibles = [];
    this.fechaYHorarioSeleccionado = undefined;
    this.horariosDisponibles = [];
    this.especialistas.forEach(especialista => {
      especialista.especialidades!.forEach((especialidad: string) => {
        if (this.especialidadSeleccionada?.nombre == especialidad) {
          this.especialistasDisponibles.push(especialista);
        }
      });
    });
  }

  seleccionarEspecialista(especialista: Usuario) {
    this.especialistaSeleccionado = especialista;
    this.cargarFechasDisponibles();
  }

  cargarFechasDisponibles(): void {
    this.fechaSeleccionada = undefined;
    this.fechasDisponibles = [];
    this.fechaYHorarioSeleccionado = undefined;
    this.horariosDisponibles = [];
    const diasQueTrabaja = this.especialistaSeleccionado!.disponibilidad!.filter((dia: Dia) => dia.trabaja).map((dia: Dia) => dia.dia);
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    let fecha = new Date();
    fecha.setHours(0, 0, 0, 0);
    let contador = 0;

    while (contador < 15) {
      fecha.setDate(fecha.getDate() + 1);
      const nombreDia = diasSemana[fecha.getDay()];
      if (diasQueTrabaja!.includes(nombreDia)) {
        const fechaDisponible = new Date(fecha);
        this.fechasDisponibles.push(fechaDisponible);
      }
      contador++;
    }
  }

  seleccionarFecha(fecha: Date) {
    this.fechaSeleccionada = fecha;
    this.cargarHorariosDisponibles();
  }


  cargarHorariosDisponibles(): void {
    this.fechaYHorarioSeleccionado = undefined;
    this.horariosDisponibles = [];
    const fecha = new Date(this.fechaSeleccionada!);
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const diaSeleccionado = diasSemana[fecha.getDay()];

    const disponibilidadDelEspecialista = this.especialistaSeleccionado!.disponibilidad!.find((dia: Dia) => dia.dia === diaSeleccionado);

    if (disponibilidadDelEspecialista && disponibilidadDelEspecialista.trabaja) {
      this.horariosDisponibles = this.obtenerOpcionesDeHorario(disponibilidadDelEspecialista.inicio, disponibilidadDelEspecialista.fin);
    }
  }


  obtenerOpcionesDeHorario(inicio: string, fin: string): { horario: Date, disponible: boolean }[] {
    const opciones: { horario: Date, disponible: boolean }[] = [];
    const [inicioHora, inicioMinutos] = inicio.split(':').map(Number);
    const [finHora, finMinutos] = fin.split(':').map(Number);

    const fechaInicio = new Date(this.fechaSeleccionada!);
    fechaInicio.setHours(inicioHora, inicioMinutos, 0, 0);

    const fechaFin = new Date(this.fechaSeleccionada!);
    fechaFin.setHours(finHora, finMinutos, 0, 0);

    let opcionHorario = fechaInicio;
    while (opcionHorario <= fechaFin) {
      const disponible = !this.turnos.some(turno => {
        const turnoFecha = turno.fechaCompleta;
        return turnoFecha.getTime() == opcionHorario.getTime() &&
            ((turno.correoPaciente == this.pacienteSeleccionado?.correo) ||
            (turno.correoEspecialista == this.especialistaSeleccionado?.correo)) &&
            turno.estado !== 'Cancelado';
      });
      opciones.push({ horario: opcionHorario, disponible });
      opcionHorario = new Date(opcionHorario.getTime() + 30 * 60 * 1000);
    }

    return opciones;
  }

  seleccionarHorario(horario: Date) {
    this.fechaYHorarioSeleccionado = horario;
  }

  async generarTurno() {
    if (this.pacienteSeleccionado && this.especialidadSeleccionada && this.especialistaSeleccionado && this.fechaSeleccionada && this.fechaYHorarioSeleccionado) {
      this._notificationService.showLoadingAlert('Generando nuevo turno...');
      try {
        let turno: Turno = {
          correoPaciente: this.pacienteSeleccionado.correo,
          nombrePaciente: this.pacienteSeleccionado.nombre + ' ' + this.pacienteSeleccionado.apellido,
          especialidad: this.especialidadSeleccionada.nombre,
          correoEspecialista: this.especialistaSeleccionado.correo,
          nombreEspecialista: this.especialistaSeleccionado.nombre + ' ' + this.especialistaSeleccionado.apellido,
          fechaCompleta: this.fechaYHorarioSeleccionado!,
          estado: 'Pendiente'
        }
        
        const turnoId = await this._databaseService.setDocument('turnos', turno);
        await this._databaseService.updateDocument('turnos', { id: turnoId }, turnoId);

        this._notificationService.closeAlert();
        this._notificationService.showAlert('¡Turno generado con exito!', 'success', 2000);
        if(this.infoUsuario!.tipo == 'Administrador') {
          this._notificationService.routerLink('/turnos');
        }
        else {
          this._notificationService.routerLink('/mis-turnos');
        }
      } 
      catch (error: any) {
        this._notificationService.closeAlert();
        this._notificationService.showAlert('Error inesperado: ' + error.code, 'error', 2000);
      }
    } 
    else {
      this._notificationService.showAlert('Por favor, complete todos los campos antes de confirmar.', 'error', 2000);
    }
  }
  

}


