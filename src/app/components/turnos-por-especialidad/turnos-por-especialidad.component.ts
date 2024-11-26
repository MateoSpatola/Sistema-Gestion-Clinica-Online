import { Component, inject } from '@angular/core';
import Chart, { ChartType } from 'chart.js/auto';
import { DatabaseService } from '../../services/database.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-turnos-por-especialidad',
  standalone: true,
  imports: [],
  templateUrl: './turnos-por-especialidad.component.html',
  styleUrl: './turnos-por-especialidad.component.css'
})
export class TurnosPorEspecialidadComponent {

  private _databaseService = inject(DatabaseService);
  protected chartListo = false;

  ngOnInit() {
    let turnosPorEspecialidad: Record<string, number> = {}

    this._databaseService.getDocument('turnos').subscribe(response => {
      response.forEach((res: any) => {
        turnosPorEspecialidad[res.especialidad] = (turnosPorEspecialidad[res.especialidad] || 0) + 1;
      });

      const chart = document.getElementById('turnosPorEspecialidadChart') as HTMLCanvasElement;
  
      new Chart(chart, {
        type: 'polarArea' as ChartType,
        data: {
          labels: Object.keys(turnosPorEspecialidad),
          datasets: [
            {
              label: 'Cantidad de turnos',
              data: Object.values(turnosPorEspecialidad),
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(255, 99, 71, 0.6)',
                'rgba(100, 149, 237, 0.6)',
                'rgba(60, 179, 113, 0.6)',
                'rgba(255, 20, 147, 0.6)',
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
                font: {
                  size: 20 
                }
              }
            },
            tooltip: { enabled: true }
          },
          scales: {
            x: {
              ticks: {
                font: {
                  size: 18
                },
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: 18 
                }
              }
            }
          }
        }
      });

      this.chartListo = true;
    })
  }


  descargarPDFTurnosPorEspecialidad() {
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
    pdf.text(`Gráfico Cantidad de Turnos por Especialidad `, 105, 45, { align: 'center' });

    const chart = document.getElementById('turnosPorEspecialidadChart') as HTMLCanvasElement;
    if (chart) {
      const chartImage = chart.toDataURL('image/png');
      pdf.addImage(chartImage, 'PNG', 15, 60, 180, 180);
    }
    
    pdf.save(`grafico-cantidad-turnos-por-especialidad.pdf`);
  }

}
