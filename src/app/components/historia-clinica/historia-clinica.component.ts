import { Component, inject, Input } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { DatabaseService } from '../../services/database.service';
import { Turno } from '../../models/turno';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';

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
  @Input() paciente?: Usuario;
  @Input() especialista?: Usuario;
  @Input() verResenia: boolean = false;

  private _databaseService = inject(DatabaseService);
  objectKeys = Object.keys;

  protected turnosConHistoriaClinica: Turno[] = [];
  protected turnosConHistoriaClinicaFiltrados: Turno[] = [];
  protected especialidadesUnicas: string[] = [];
  protected especialidadSeleccionada: string = '';

  protected especialistasUnicos: string[] = [];
  protected especialistaSeleccionado: string = '';

  ngOnInit(): void {
    this._databaseService.getDocument('turnos').subscribe(response => {
      response.forEach((res: any) => {
        if(res.historiaClinica) {
          if(this.paciente?.correo == res.correoPaciente) {
            res.fechaCompleta = this._databaseService.convertTimestampToDate(res.fechaCompleta);
            this.turnosConHistoriaClinica.push(res);
            this.especialidadesUnicas.push(res.especialidad);
            this.especialistasUnicos.push(res.nombreEspecialista);
          }
        }
      });
      this.especialidadesUnicas = [...new Set(this.especialidadesUnicas)];
      this.especialistasUnicos = [...new Set(this.especialistasUnicos)];
      if(this.especialista) {
        this.turnosConHistoriaClinica = this.turnosConHistoriaClinica.filter(turno => turno.correoEspecialista === this.especialista?.correo);
      }
      this.turnosConHistoriaClinicaFiltrados = this.turnosConHistoriaClinica;
    });
  }


  filtrarTurnos() {
    this.turnosConHistoriaClinicaFiltrados = this.turnosConHistoriaClinica.filter(turno => {
      const coincideEspecialidad = this.especialidadSeleccionada
        ? turno.especialidad === this.especialidadSeleccionada
        : true;
      const coincideEspecialista = this.especialistaSeleccionado
        ? turno.nombreEspecialista === this.especialistaSeleccionado
        : true;
      return coincideEspecialidad && coincideEspecialista;
    });
  }
  
  seleccionarEspecialidad(especialidad: string) {
    this.especialidadSeleccionada = especialidad;
    this.filtrarTurnos(); // Recalcula los turnos filtrados
  }
  
  seleccionarEspecialista(especialista: string) {
    this.especialistaSeleccionado = especialista;
    this.filtrarTurnos(); // Recalcula los turnos filtrados
  }

  descargarPDFHistoriaClinica() {
    const pdf = new jsPDF();
    const fechaActual = new Date().toLocaleString();

    pdf.addImage('logo.png', 'PNG', 5, 5, 20, 20);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Fecha de emisión: ${fechaActual}`, 200, 17, { align: 'right' });

    pdf.setLineWidth(0.5);
    pdf.line(0, 30, 210, 30);

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Informe de Historia Clínica para ${this.paciente?.nombre + ' ' + this.paciente?.apellido}`, 105, 45, { align: 'center' });

    let yPosition = 65;
    let margen = 70;
    this.turnosConHistoriaClinicaFiltrados.forEach((turno, index) => {
        if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
        }

        pdf.setLineWidth(0.2);
        pdf.line(60, yPosition - 10, 150, yPosition - 10);

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Turno ${index + 1}`, 105, yPosition, { align: 'center' });
        yPosition += 10;

        pdf.setFont('helvetica', 'normal');
        pdf.text(`Fecha y hora: ${turno.fechaCompleta.toLocaleString()}`, margen, yPosition, { align: 'left' });
        yPosition += 10;

        pdf.text(`Especialista: ${turno.nombreEspecialista}`, margen, yPosition, { align: 'left' });
        yPosition += 10;
        pdf.text(`Especialidad: ${turno.especialidad}`, margen, yPosition, { align: 'left' });
        yPosition += 10;

        const historia = turno.historiaClinica;
        pdf.text(`Altura: ${historia?.altura || 'N/A'} cm`, margen, yPosition, { align: 'left' });
        yPosition += 10;
        pdf.text(`Peso: ${historia?.peso || 'N/A'} kg`, margen, yPosition, { align: 'left' });
        yPosition += 10;
        pdf.text(`Temperatura: ${historia?.temperatura || 'N/A'} °C`, margen, yPosition, { align: 'left' });
        yPosition += 10;
        pdf.text(`Presión arterial: ${historia?.presionSistolica || 'N/A'}/${historia?.presionDiastolica || 'N/A'} mmHg`, margen, yPosition, { align: 'left' });
        yPosition += 10;

        if (historia?.datosDinamicos) {
          Object.entries(historia.datosDinamicos).forEach(([clave, valor]) => {
              pdf.text(`${clave}: ${valor}`, margen, yPosition, { align: 'left' });
              yPosition += 10;

              if (yPosition > 270) {
                  pdf.addPage();
                  yPosition = 20;
              }
          });
        }

        pdf.setLineWidth(0.1);
        pdf.line(60, yPosition, 150, yPosition);

        yPosition += 10;
    });

    pdf.save(`Informe-historia-clinica-${this.paciente?.nombre + '-' + this.paciente?.apellido}.pdf`);
  }

}
