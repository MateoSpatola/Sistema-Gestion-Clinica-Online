import { Component, inject } from '@angular/core';
import Chart, { ChartType } from 'chart.js/auto';
import { DatabaseService } from '../../services/database.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-turnos-por-dia',
  standalone: true,
  imports: [],
  templateUrl: './turnos-por-dia.component.html',
  styleUrl: './turnos-por-dia.component.css'
})
export class TurnosPorDiaComponent {

  private _databaseService = inject(DatabaseService);
  protected chartListo = false;

  ngOnInit() {
    let turnosPorDiaSemana: Record<string, number> = {
      Lunes: 0,
      Martes: 0,
      Miercoles: 0,
      Jueves: 0,
      Viernes: 0,
      Sabado: 0,
    };

    this._databaseService.getDocument('turnos').subscribe(response => {
      response.forEach((res: any) => {
        const fecha = this._databaseService.convertTimestampToDate(res.fechaCompleta);

        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const diaSemana = diasSemana[fecha.getDay()];

        if (diaSemana !== 'Domingo') {
          turnosPorDiaSemana[diaSemana]++;
        }
      });

      const chart = document.getElementById('turnosPorDiaChart') as HTMLCanvasElement;
  
      new Chart(chart, {
        type: 'polarArea' as ChartType,
        data: {
          labels: Object.keys(turnosPorDiaSemana),
          datasets: [
            {
              label: 'Cantidad de turnos',
              data: Object.values(turnosPorDiaSemana),
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


  descargarPDFTurnosPorDia() {
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
    pdf.text(`Gráfico Cantidad de Turnos por Día `, 105, 45, { align: 'center' });

    const chart = document.getElementById('turnosPorDiaChart') as HTMLCanvasElement;
    if (chart) {
      const chartImage = chart.toDataURL('image/png');
      pdf.addImage(chartImage, 'PNG', 15, 60, 180, 180);
    }
    
    pdf.save(`grafico-cantidad-turnos-por-dia.pdf`);
  }

}
