import { Component, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { HistoriaClinicaComponent } from "../../components/historia-clinica/historia-clinica.component";
import * as XLSX from 'xlsx';
import { Turno } from '../../models/turno';
import { FormatoDniPipe } from '../../pipes/formato-dni.pipe';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    RouterLink,
    HistoriaClinicaComponent,
    FormatoDniPipe
],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {

  private _databaseService = inject(DatabaseService);
  protected usuarios: Usuario[] = [];
  protected pacienteSeleccionado!: Usuario;
  protected verHistoriaClinica: boolean = false;

  ngOnInit() {
    this._databaseService.getDocument('usuarios').subscribe(response => {
      this.usuarios = [];
      response.forEach((res: any) => {
        this.usuarios.push(res);
      });
    })
  }

  switchHabilitado(usuario: Usuario, event: any): void {
    const nuevoEstado = event.target.checked;
    this._databaseService.updateDocument('usuarios', { habilitado: nuevoEstado }, usuario.correo);
  }

  mostrarHistoriaClinica(usuario: Usuario) {
    this.pacienteSeleccionado = usuario;
    this.verHistoriaClinica = true;
  }

  descargarExcelDatosUsuarios() {
    const datos = this.usuarios.map(usuario => ({
        Tipo: usuario.tipo,
        Habilitado: usuario.habilitado !== undefined ? (usuario.habilitado ? 'Sí' : 'No') : '-',
        Nombre: usuario.nombre,
        Apellido: usuario.apellido,
        Edad: usuario.edad,
        DNI: usuario.dni,
        'Obra Social': usuario.obraSocial || '-',
        Especialidades: usuario.especialidades ? usuario.especialidades.join(', ') : '-',
        Correo: usuario.correo,
        'Imagen de Perfil': usuario.imagenPerfil,
        'Imagen de Portada': usuario.imagenPortada || '-'
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');

    XLSX.writeFile(wb, 'usuarios.xlsx');
  }

  descargarExcelTurnosUsuario(correo: string) {
    let turnosPaciente : Turno[] = [];
    this._databaseService.getDocument('turnos').subscribe(response => {
      response.forEach((res: any) => {
        if(correo == res.correoPaciente) {
          res.fechaCompleta = this._databaseService.convertTimestampToDate(res.fechaCompleta);
          turnosPaciente.push(res);
        }
      });

      const datos = turnosPaciente.map(turno => {
        const datosDinamicos = this.obtenerClavesYValores(turno.historiaClinica?.datosDinamicos || {});
        return {
            'Fecha y Hora': turno.fechaCompleta.toLocaleString(),
            'Especialista': turno.nombreEspecialista,
            'Correo Especialista': turno.correoEspecialista,
            'Paciente': turno.nombrePaciente,
            'Correo Paciente': turno.correoPaciente,
            'Especialidad': turno.especialidad,
            'Estado': turno.estado,
            'Cancelado Por': turno.canceladoPor || '-',
            'Motivo de Cancelación': turno.motivoCancelacion || '-',
            'Motivo de Rechazo': turno.motivoRechazo || '-',
            'Reseña': turno.resenia || '-',
            'Encuesta': turno.encuesta || '-',
            'Calificación': turno.calificacion || '-',
            'Altura (cm)': turno.historiaClinica?.altura || '-',
            'Peso (kg)': turno.historiaClinica?.peso || '-',
            'Temperatura (°C)': turno.historiaClinica?.temperatura || '-',
            'Presión Sistólica': turno.historiaClinica?.presionSistolica || '-',
            'Presión Diastólica': turno.historiaClinica?.presionDiastolica || '-',
            'Clave 1': datosDinamicos[0]?.clave || '-',
            'Valor 1': datosDinamicos[0]?.valor || '-',
            'Clave 2': datosDinamicos[1]?.clave || '-',
            'Valor 2': datosDinamicos[1]?.valor || '-',
            'Clave 3': datosDinamicos[2]?.clave || '-',
            'Valor 3': datosDinamicos[2]?.valor || '-'
        };
      });

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Turnos');

      XLSX.writeFile(wb, `turnos_${correo}.xlsx`);
    });
  }

  private obtenerClavesYValores(datosDinamicos: { [clave: string]: string }) {
    const resultado: { clave: string; valor: string }[] = [];
    Object.entries(datosDinamicos).forEach(([clave, valor], index) => {
        if (index < 3) {
            resultado.push({ clave, valor });
        }
    });
    return resultado;
  }

}
