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

  protected infoPacientes: Usuario[] = [];
  protected infoEspecialistas: Usuario[] = [];
  protected especialidades: Especialidad[] = [];
  protected especialistas: Usuario[] = [];
  protected fechasDisponibles: Date[] = [];
  protected horasDisponibles: string[] = [];
  
  protected correoPacienteSeleccionado: string = '';
  protected nombrePacienteSeleccionado: string = '';
  protected especialidadSeleccionada: string = '';
  protected correoEspecialistaSeleccionado: string = '';
  protected infoEspecialistaSeleccionado!: Usuario | null;
  protected fechaSeleccionada: string = '';
  protected horaSeleccionada: string = '';


  async ngOnInit() {
    let user = this._authService.auth.currentUser;
    if (user) {
      this.infoUsuario = await this._databaseService.getDocumentById('usuarios', user.email!);
    }
    if (this.infoUsuario?.tipo == 'Paciente') {
      this.correoPacienteSeleccionado = this.infoUsuario.correo;
      this.nombrePacienteSeleccionado = this.infoUsuario.nombre + ' ' + this.infoUsuario.apellido;
    }

    this._databaseService.getDocument('usuarios').subscribe(response => {
      this.infoEspecialistas = [];
      response.forEach((res: any) => {
        if(res.tipo == 'Especialista') {
          this.infoEspecialistas.push(res);
        }
        else if (res.tipo == 'Paciente') {
          this.infoPacientes.push(res);
        }
      });
    });

    this._databaseService.getDocument('especialidades').subscribe(response => {
      response.forEach((res: any) => {
        this.especialidades.push(res);
      });
    });
  }

  async seleccionarPaciente() {
    let paciente = await this._databaseService.getDocumentById('usuarios', this.correoPacienteSeleccionado);
    this.correoPacienteSeleccionado = this.correoPacienteSeleccionado;
    this.nombrePacienteSeleccionado = paciente.nombre + ' ' + paciente.apellido;
  }


  cargarEspecialistas(): void {
    this.especialistas = [];
    this.correoEspecialistaSeleccionado = "";
    this.infoEspecialistaSeleccionado = null;
    this.fechaSeleccionada = "";
    this.fechasDisponibles = [];
    this.horaSeleccionada = "";
    this.horasDisponibles = [];
    
    this.infoEspecialistas.forEach(especialista => {
      especialista.especialidades!.forEach((especialidad: string) => {
        if (this.especialidadSeleccionada == especialidad) {
          this.especialistas.push(especialista);
        }
      });
    });
  }


  cargarFechasDisponibles(): void {
    this.fechaSeleccionada = "";
    this.fechasDisponibles = [];
    this.horaSeleccionada = "";
    this.horasDisponibles = [];

    this.infoEspecialistas.forEach(especialista => {
      if(this.correoEspecialistaSeleccionado == especialista.correo) {
        this.infoEspecialistaSeleccionado = especialista;
      }
    })

    const diasQueTrabaja = this.infoEspecialistaSeleccionado!.disponibilidad!.filter((dia: Dia) => dia.trabaja).map((dia: Dia) => dia.dia);
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    let fecha = new Date();
    fecha.setHours(0, 0, 0, 0);
    let contador = 0;

    while (contador < 15) {
      fecha.setDate(fecha.getDate() + 1);
      const nombreDia = diasSemana[fecha.getDay()];
      if (diasQueTrabaja.includes(nombreDia)) {
        const fechaDisponible = new Date(fecha);
        this.fechasDisponibles.push(fechaDisponible);
      }
      contador++;
    }
  }


  cargarHorariosDisponibles(): void {
    this.horaSeleccionada = "";
    this.horasDisponibles = [];
    const fecha = new Date(this.fechaSeleccionada);
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const diaSeleccionado = diasSemana[fecha.getDay()];

    const disponibilidadDelEspecialista = this.infoEspecialistaSeleccionado!.disponibilidad!.find((dia: Dia) => dia.dia === diaSeleccionado);

    if (disponibilidadDelEspecialista && disponibilidadDelEspecialista.trabaja) {
      this.horasDisponibles = this.obtenerOpcionesDeHorario(disponibilidadDelEspecialista.inicio, disponibilidadDelEspecialista.fin);
    }
  }


  obtenerOpcionesDeHorario(inicio: string, fin: string): string[] {
    const opciones: string[] = [];
    const [inicioHora, inicioMinutos] = inicio.split(':').map(Number);
    const [finHora, finMinutos] = fin.split(':').map(Number);

    const fechaInicio = new Date(this.fechaSeleccionada);
    fechaInicio.setHours(inicioHora, inicioMinutos, 0, 0);

    const fechaFin = new Date(this.fechaSeleccionada);
    fechaFin.setHours(finHora, finMinutos, 0, 0);

    let opcionHora = fechaInicio;
    while (opcionHora <= fechaFin) {
      const horaFormateada = `${opcionHora.getHours()}:${opcionHora.getMinutes() < 10 ? '0' + opcionHora.getMinutes() : opcionHora.getMinutes()}`;
      opciones.push(horaFormateada);
      opcionHora = new Date(opcionHora.getTime() + 30 * 60 * 1000);
    }
    return opciones;
  }


  combinarFechaYHora(fecha: string, hora: string): Date {
    const [horaSeleccionada, minutosSeleccionados] = hora.split(':').map(Number);
    const fechaCompleta = new Date(fecha);
    fechaCompleta.setHours(horaSeleccionada, minutosSeleccionados, 0, 0);
    return fechaCompleta;
  }
  

  async generarTurno() {
    if (this.correoPacienteSeleccionado && this.especialidadSeleccionada && this.correoEspecialistaSeleccionado && this.fechaSeleccionada && this.horaSeleccionada) {
      this._notificationService.showLoadingAlert('Generando nuevo turno...');
      try {
        const fechaCompleta = this.combinarFechaYHora(this.fechaSeleccionada, this.horaSeleccionada);
        let turno: Turno = {
          correoPaciente: this.correoPacienteSeleccionado,
          nombrePaciente: this.nombrePacienteSeleccionado,
          especialidad: this.especialidadSeleccionada,
          correoEspecialista: this.correoEspecialistaSeleccionado,
          nombreEspecialista: this.infoEspecialistaSeleccionado?.nombre + ' ' + this.infoEspecialistaSeleccionado?.apellido,
          fechaCompleta: fechaCompleta,
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


