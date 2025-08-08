import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { ChartOptions } from './apex-chart.model';
import { SERIES } from './data';

@Component({
  selector: 'app-charts-apex-chart',
  templateUrl: './apex.component.html',
  styleUrls: ['./apex.component.scss']
})
export class ApexComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  lineChartOptions1: Partial<ChartOptions> = {};
  lineChartOptions2: Partial<ChartOptions> = {};
  barChartOptions1: Partial<ChartOptions> = {};
  barChartOptions2: Partial<ChartOptions> = {};
  pieChartOption1: Partial<ChartOptions> = {};
  donutChartOptions1: Partial<ChartOptions> = {};
  radialChartOptions1: Partial<ChartOptions> = {};
  radialChartOptions2: Partial<ChartOptions> = {};
  mixedChartOptions: Partial<ChartOptions> = {};

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Charts', path: '/' }, { label: 'Apex Charts', path: '/', active: true }];
    this.initLineChart();
    this.initBarChart();
    this.initPieCharts();
    this.initRadialCharts();
    this.initMixedChart();
  }

  /**
   * initialize line chart config
   */
  initLineChart(): void {
    this.lineChartOptions1 = {
      series: [
        {
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 18]
        }
      ],
      chart: {
        height: 350,

        type: "line",
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth",
        width: 4
      },
      title: {
        text: "Product Trends by Month",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      colors: ['#727cf5'],
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep"
        ]
      }
    };

    this.lineChartOptions2 = {
      series: [
        {
          name: "series",
          data: SERIES.monthDataSeries1.prices
        }
      ],
      chart: {
        height: 350,
        type: "line",
        toolbar: {
          show: false
        }
      },
      annotations: {
        yaxis: [
          {
            y: 8200,
            borderColor: "#00E396",
            label: {
              borderColor: "#00E396",
              style: {
                color: "#fff",
                background: "#00E396"
              },
              text: "Support"
            }
          }

        ],
        xaxis: [
          {
            x: new Date("23 Nov 2017").getTime(),
            strokeDashArray: 0,
            borderColor: "#775DD0",
            label: {
              borderColor: "#775DD0",
              style: {
                color: "#fff",
                background: "#775DD0"
              },
              text: "Anno Test"
            }
          },
          {
            x: new Date("26 Nov 2017").getTime(),
            x2: new Date("28 Nov 2017").getTime(),
            fillColor: "#B3F7CA",
            opacity: 0.4,
            label: {
              borderColor: "#B3F7CA",
              style: {
                fontSize: "10px",
                color: "#fff",
                background: "#00E396"
              },
              offsetY: -10,
              text: "X-axis range"
            }
          }
        ],
        points: [
          {
            x: new Date("01 Dec 2017").getTime(),
            y: 8607.55,
            marker: {
              size: 8,
              fillColor: "#fff",
              strokeColor: "red",
              radius: 2,
              cssClass: "apexcharts-custom-class"
            },
            label: {
              borderColor: "#FF4560",
              offsetY: 0,
              style: {
                color: "#fff",
                background: "#FF4560"
              },

              text: "Point Annotation"
            }
          }
        ]
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight",
        width: 3
      },
      grid: {
        padding: {
          right: 30,
          left: 20
        }
      },
      colors: ['#727cf5'],
      title: {
        text: "Line with Annotations",
        align: "left"
      },
      labels: SERIES.monthDataSeries1.dates,
      xaxis: {
        type: "datetime"
      }
    };


  }

  /**
   * initialize bar chart config
   */
  initBarChart(): void {
    this.barChartOptions1 = {
      series: [
        {
          name: "basic",
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
        }
      ],
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [
          "South Korea",
          "Canada",
          "United Kingdom",
          "Netherlands",
          "Italy",
          "France",
          "Japan",
          "United States",
          "China",
          "Germany"
        ]
      },
      colors: ['#39afd1']
    };

    this.barChartOptions2 = {
      series: [
        {
          name: "Marine Sprite",
          data: [44, 55, 41, 37, 22, 43, 21]
        },
        {
          name: "Striking Calf",
          data: [53, 32, 33, 52, 13, 43, 32]
        },
        {
          name: "Tank Picture",
          data: [12, 17, 11, 9, 15, 11, 20]
        },
        {
          name: "Bucket Slope",
          data: [9, 7, 5, 8, 6, 9, 4]
        },
        {
          name: "Reborn Kid",
          data: [25, 12, 19, 32, 25, 24, 10]
        }
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: false
        }

      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },

      xaxis: {
        categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
        labels: {
          formatter: (val: string) => {
            return val + "K";
          }
        }
      },
      yaxis: {
        title: {
          text: undefined
        }
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + "K";
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40
      }
    };
  }

  /**
   * initialize pie chart config
   */
  initPieCharts(): void {
    this.pieChartOption1 = {
      chart: {
        height: 320,
        type: 'pie',
        toolbar: {
          show: false
        }
      },
      series: [44, 55, 41, 17, 15],
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      colors: ["#6658dd", "#4fc6e1", "#4a81d4", "#00b19d", "#f1556c"],
      dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        // verticalAlign: 'middle',
        floating: false,
        fontSize: '14px',
        offsetX: 0,
        offsetY: -10
      },
      responsive: [{
        breakpoint: 600,
        options: {
          chart: {
            height: 240
          },
          legend: {
            show: false
          },
        }
      }]
    }

    this.donutChartOptions1 = {
      series: [44, 55, 13, 43, 22],
      chart: {
        height: 320,
        type: "donut",
        toolbar: {
          show: false
        }
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      colors: ["#6658dd", "#4fc6e1", "#4a81d4", "#00b19d", "#f1556c"],
      fill: {
        type: 'gradient'
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        // verticalAlign: 'middle',
        floating: false,
        fontSize: '14px',
        offsetX: 0,
        offsetY: -10
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  /**
   * initialize radial chart config
   */
  initRadialCharts(): void {
    this.radialChartOptions1 = {
      series: [70],
      chart: {
        height: 350,
        type: "radialBar",
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "70%"
          }
        }
      },
      labels: ["Cricket"],
      colors: ['#39afd1']
    };

    this.radialChartOptions2 = {
      series: [44, 55, 67, 83],
      chart: {
        height: 350,
        type: "radialBar",
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            // showOn: 'hover',
            name: {
              fontSize: "22px"
            },
            value: {
              fontSize: "16px"
            },
          }
        }
      },
      labels: ["Apples", "Oranges", "Bananas", "Berries"]
    };
  }

  /**
   *  initialize mixed chart config
   */
  initMixedChart(): void {
    this.mixedChartOptions = {
      series: [
        {
          name: "TEAM A",
          type: "column",
          data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
        },
        {
          name: "TEAM B",
          type: "area",
          data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
        },
        {
          name: "TEAM C",
          type: "line",
          data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
        }
      ],
      chart: {
        height: 350,
        type: "line",
        stacked: false,
        toolbar: {
          show: false,
        }
      },
      stroke: {
        width: [0, 2, 5],
        curve: "smooth"
      },
      plotOptions: {
        bar: {
          columnWidth: "50%"
        }
      },
      colors: ['#727cf5', '#39afd1', '#fa5c7c'],
      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: "light",
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100]
        }
      },
      labels: [
        "01/01/2003",
        "02/01/2003",
        "03/01/2003",
        "04/01/2003",
        "05/01/2003",
        "06/01/2003",
        "07/01/2003",
        "08/01/2003",
        "09/01/2003",
        "10/01/2003",
        "11/01/2003"
      ],
      markers: {
        size: 0
      },
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        title: {
          text: "Points"
        },
        min: 0
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y: number) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " points";
            }
            return y;
          }
        }
      }
    };
  }
}
