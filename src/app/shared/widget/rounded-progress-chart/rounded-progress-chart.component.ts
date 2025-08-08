import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from 'src/app/pages/charts/apex/apex-chart.model';

@Component({
  selector: 'app-widget-rounded-progress-chart',
  templateUrl: './rounded-progress-chart.component.html',
  styleUrls: ['./rounded-progress-chart.component.scss']
})
export class RoundedProgressChartComponent implements OnInit {

  @Input() cardTitle: string = '';
  @Input() progress: number = 0;
  @Input() variant: string = '';
  @Input() totalSales: string = '';
  @Input() target: string = '';
  @Input() lastWeek: string = '';
  @Input() lastMonth: string = '';
  //chart options
  chartOptions: Partial<ChartOptions> = {};

  constructor () { }

  ngOnInit(): void {
    this.chartOptions = {
      series: [this.progress],
      chart: {
        height: 180,
        type: 'radialBar',

      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "65%"
          },
          dataLabels: {
            name: {
              show: false,
              color: '#fff',
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: '700',
              offsetY: 12,
              formatter: (val) => {
                return String(val);
              },
            },
          }
        }
      },
      colors: [this.variant],
      stroke: {
        lineCap: 'round'
      },
    };
  }

}
