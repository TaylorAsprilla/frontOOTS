import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'src/app/pages/charts/apex/apex-chart.model';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { LeadItem, PerformanceData } from '../shared/crm.model';
import { RECENTLEADS, TOPPERFORMING } from '../shared/data';

@Component({
  selector: 'app-crm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  dealsChart: Partial<ChartOptions> = {};
  salesChart: Partial<ChartOptions> = {};
  ratioChart: Partial<ChartOptions> = {};
  topPerformingData: PerformanceData[] = [];
  recentLeads: LeadItem[] = [];


  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'CRM', path: '/' }, { label: 'Dashboard', path: '/', active: true }];
    this._fetchData();
    this.initCharts();
  }

  /**
   * fetch data
   */
  _fetchData(): void {
    this.topPerformingData = TOPPERFORMING;
    this.recentLeads = RECENTLEADS;
  }

  /**
   * initialize charts
   */
  initCharts(): void {
    this.dealsChart = {
      series: [{
        name: 'Won',
        type: 'column',
        data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
      }, {
        name: 'Loss',
        type: 'line',
        data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
      }],
      chart: {
        height: 370,
        type: 'line',
      },
      stroke: {
        width: [2, 3]
      },
      plotOptions: {
        bar: {
          columnWidth: '50%'
        }
      },
      colors: ['#1abc9c', '#f1556c'],
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
      },
      labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
      xaxis: {
        type: 'datetime'
      },
      legend: {
        offsetY: 7,
      },
      grid: {
        padding: {
          bottom: 20
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.75,
          opacityTo: 0.75,
          stops: [0, 0, 0]
        },
      },
      yaxis: [{
        title: {
          text: 'Net Revenue',
        },

      }, {
        opposite: true,
        title: {
          text: 'Number of Sales'
        }
      }]
    }

    this.salesChart = {
      chart: {
        height: 370,
        type: 'candlestick',
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#6658dd',
            downward: '#1abc9c'
          }
        }
      },
      series: [{
        data: [{
          x: new Date(2016, 1, 1),
          y: [51.98, 56.29, 51.59, 53.85]
        },
        {
          x: new Date(2016, 2, 1),
          y: [53.66, 54.99, 51.35, 52.95]
        },
        {
          x: new Date(2016, 3, 1),
          y: [52.96, 53.78, 51.54, 52.48]
        },
        {
          x: new Date(2016, 4, 1),
          y: [52.54, 52.79, 47.88, 49.24]
        },
        {
          x: new Date(2016, 5, 1),
          y: [49.10, 52.86, 47.70, 52.78]
        },
        {
          x: new Date(2016, 6, 1),
          y: [52.83, 53.48, 50.32, 52.29]
        },
        {
          x: new Date(2016, 7, 1),
          y: [52.20, 54.48, 51.64, 52.58]
        },
        {
          x: new Date(2016, 8, 1),
          y: [52.76, 57.35, 52.15, 57.03]
        },
        {
          x: new Date(2016, 9, 1),
          y: [57.04, 58.15, 48.88, 56.19]
        },
        {
          x: new Date(2016, 10, 1),
          y: [56.09, 58.85, 55.48, 58.79]
        },
        {
          x: new Date(2016, 11, 1),
          y: [58.78, 59.65, 58.23, 59.05]
        },
        {
          x: new Date(2017, 0, 1),
          y: [59.37, 61.11, 59.35, 60.34]
        },
        {
          x: new Date(2017, 1, 1),
          y: [60.40, 60.52, 56.71, 56.93]
        },
        {
          x: new Date(2017, 2, 1),
          y: [57.02, 59.71, 56.04, 56.82]
        },
        {
          x: new Date(2017, 3, 1),
          y: [56.97, 59.62, 54.77, 59.30]
        },
        {
          x: new Date(2017, 4, 1),
          y: [59.11, 62.29, 59.10, 59.85]
        },
        {
          x: new Date(2017, 5, 1),
          y: [59.97, 60.11, 55.66, 58.42]
        },
        {
          x: new Date(2017, 6, 1),
          y: [58.34, 60.93, 56.75, 57.42]
        },
        {
          x: new Date(2017, 7, 1),
          y: [57.76, 58.08, 51.18, 54.71]
        },
        {
          x: new Date(2017, 8, 1),
          y: [54.80, 61.42, 53.18, 57.35]
        },
        {
          x: new Date(2017, 9, 1),
          y: [57.56, 63.09, 57.00, 62.99]
        },
        {
          x: new Date(2017, 10, 1),
          y: [62.89, 63.42, 59.72, 61.76]
        },
        {
          x: new Date(2017, 11, 1),
          y: [61.71, 64.15, 61.29, 63.04]
        }]
      }],

      stroke: {
        show: true,
        colors: ['#f1f3fa'],
        width: 1
      },
      xaxis: {
        type: 'datetime'
      },
      grid: {
        borderColor: '#f1f3fa'
      }
    }

    this.ratioChart = {
      chart: {
        height: 310,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          dataLabels: {
            name: {
              fontSize: '16px',
              color: undefined,
              offsetY: 120
            },
            value: {
              offsetY: 76,
              fontSize: '22px',
              color: undefined,
              formatter: function (val) {
                return val + "%";
              }
            }
          }
        }
      },
      fill: {
        gradient: {
          // enabled: true,
          shade: 'dark',
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 65, 91]
        },
      },
      stroke: {
        dashArray: 4
      },
      colors: ["#f1556c"],
      series: [67],
      labels: ['Campaigns Ratio'],
      responsive: [{
        breakpoint: 380,
        options: {
          chart: {
            height: 180
          }
        }
      }]
    }
  }

}
