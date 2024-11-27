import { Component, inject } from '@angular/core';
import Chart, { ChartType } from 'chart.js/auto';
import { DatabaseService } from '../../services/database.service';
import jsPDF from 'jspdf';
import { FormsModule } from '@angular/forms';
import { Turno } from '../../models/turno';

@Component({
  selector: 'app-turnos-finalizados',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './turnos-finalizados.component.html',
  styleUrl: './turnos-finalizados.component.css'
})
export class TurnosFinalizadosComponent {
  private _databaseService = inject(DatabaseService);

  protected chart: Chart | null = null;
  protected yaFiltro: boolean = false;

  protected fechaInicio: string = '';
  protected fechaFin: string = '';

  protected turnosFinalizados: Turno[] = [];
  protected turnosFiltrados: Turno[] = [];

  ngOnInit() {
    this._databaseService.getDocument('turnos').subscribe(response => {
      response.forEach((res: any) => {
        if(res.estado == 'Realizado') {
          res.fechaCompleta = this._databaseService.convertTimestampToDate(res.fechaCompleta);
          this.turnosFinalizados.push(res);
        }
      });
    })
  }

  filtrarTurnosPorMedico() {
    this.yaFiltro = true;
    this.turnosFiltrados = [];
    if (this.fechaInicio != '' && this.fechaFin != ''){
      const fechaInicio = new Date(this.fechaInicio);
      const fechaFin = new Date(this.fechaFin);
      this.turnosFinalizados.forEach((turno: Turno) => {
        if (turno.fechaCompleta >= fechaInicio && turno.fechaCompleta <= fechaFin) {
          this.turnosFiltrados.push(turno);
        }
      });
    }
    if(this.turnosFiltrados.length > 0) {
      this.generarGrafico(this.turnosFiltrados);
    }
    else {
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
    }
  }

  generarGrafico(turnos: Turno[]) {
    let turnosFormateados: Record<string, number> = {};
    turnos.forEach((turno: Turno) => {
      turnosFormateados[turno.nombreEspecialista] = (turnosFormateados[turno.nombreEspecialista] || 0) + 1;
    });

    const chartCanvas = document.getElementById('turnosFinalizadosPorMedicoChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(chartCanvas, {
      type: 'polarArea' as ChartType,
      data: {
        labels: Object.keys(turnosFormateados),
        datasets: [
          {
            label: 'Cantidad de turnos finalizados',
            data: Object.values(turnosFormateados),
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
            ],
            borderColor: 'rgba(255, 255, 255, 1)',
            borderWidth: 1,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { 
            display: true,
            labels: {
              font: { size: 20 }
            }
          },
          tooltip: { enabled: true }
        },
        scales: {
          x: {
            ticks: { font: { size: 18 } },
          },
          y: {
            beginAtZero: true,
            ticks: { font: { size: 18 } }
          }
        }
      }
    });
  }


  descargarPDFTurnosFinalizadosPorMedico() {
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
    pdf.text(`Gráfico Cantidad de Turnos Finalizados por Medico`, 105, 45, { align: 'center' });

    const fechaInicio = new Date(this.fechaInicio);
    const fechaFin = new Date(this.fechaFin);
    pdf.text(`Desde el ${fechaInicio.toLocaleDateString()} al ${fechaFin.toLocaleDateString()}`, 105, 55, { align: 'center' });

    const chart = document.getElementById('turnosFinalizadosPorMedicoChart') as HTMLCanvasElement;
    if (chart) {
      const chartImage = chart.toDataURL('image/png');
      pdf.addImage(chartImage, 'PNG', 15, 70, 180, 180);
    }
    
    pdf.save(`grafico-cantidad-turnos-finalizados-por-medico.pdf`);
  }
}
