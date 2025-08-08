import { Component, Injectable, OnInit } from "@angular/core";
import {
  NgbCalendar,
  NgbDateParserFormatter,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { ChartStatistics } from "src/app/shared/widget/chart-statistics/chart-statistics.model";
import { StatisticsCard1 } from "src/app/shared/widget/statistics-card/statistics-card.model";
import { ChartOptions } from "../../charts/apex/apex-chart.model";
import { RevenueHistory, UserBalance } from "./dashboard-one.model";
import { REVENUEHISTORYDATA, USERBALANCEDATA } from "./data";

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly month_list = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  readonly DELIMITER = " ";

  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[1], 10),
        month: this.month_list.indexOf(date[0]),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date
      ? this.month_list[date.month - 1] +
          this.DELIMITER +
          date.day +
          "," +
          this.DELIMITER +
          date.year
      : "";
  }
}

@Component({
  selector: "app-dashboard-one",
  templateUrl: "./dashboard-one.component.html",
  styleUrls: ["./dashboard-one.component.scss"],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class DashboardOneComponent implements OnInit {
  statisticsCardData: StatisticsCard1[] = [];
  chartStatisticsData: ChartStatistics[] = [];
  revenuChart!: Partial<ChartOptions>;
  salesAnalyticsChart!: Partial<ChartOptions>;
  userBalanceData: UserBalance[] = [];
  revenueHistoryData: RevenueHistory[] = [];

  date!: NgbDateStruct;

  constructor(private calendar: NgbCalendar) {}

  ngOnInit(): void {
    this.date = this.calendar.getToday();
    this._fetchStatisticsData();
    this.initChart();
    this._fetchUserBalanceData();
    this._fetchRevenueHistoryData();
  }

  /**
   * fetch statistics data
   */
  _fetchStatisticsData(): void {
    this.statisticsCardData = [
      {
        id: 1,
        variant: "primary",
        description: "Participantes",
        icon: "fe-heart",
        stats: 120,
        options: {
          prefix: "",
          duration: 2,
        },
      },
      {
        id: 2,
        variant: "success",
        description: "Casos Abiertos",
        icon: "fe-user",
        stats: 127,
        options: {
          duration: 2,
        },
      },
      {
        id: 3,
        variant: "info",
        description: "Casos Cerrados",
        icon: "fe-bar-chart-line",
        stats: 80,
        options: {
          duration: 2,
        },
      },
      {
        id: 4,
        variant: "warning",
        description: "Seguimientos",
        icon: "fe-eye",
        stats: 78.41,
        options: {
          duration: 2,
        },
      },
    ];
  }

  /**
   * initialize charts
   */
  initChart(): void {
    this._fetchChartStatistics();
    this.revenuChart = {
      series: [68],
      chart: {
        height: 242,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "65%",
          },
        },
      },
      colors: ["#f86262"],
      labels: ["Revenue"],
    };

    this.salesAnalyticsChart = {
      series: [
        {
          name: "Revenue",
          type: "column",
          data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
        },
        {
          name: "Sales",
          type: "line",
          data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
        },
      ],
      chart: {
        height: 378,
        type: "line",
        offsetY: 10,
        toolbar: {
          show: false,
        },
      },
      stroke: {
        width: [2, 3],
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
        },
      },
      colors: ["#1abc9c", "#4a81d4"],
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      labels: [
        "01/01/2001",
        "02/01/2001",
        "03/01/2001",
        "04/01/2001",
        "05/01/2001",
        "06/01/2001",
        "07/01/2001",
        "08/01/2001",
        "09/01/2001",
        "10/01/2001",
        "11/01/2001",
        "12/01/2001",
      ],
      xaxis: {
        type: "datetime",
      },
      legend: {
        offsetY: 7,
      },
      grid: {
        padding: {
          bottom: 20,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.75,
          opacityTo: 0.75,
          stops: [0, 0, 0],
        },
      },
      yaxis: [
        {
          title: {
            text: "Net Revenue",
          },
        },
        {
          opposite: true,
          title: {
            text: "Number of Sales",
          },
        },
      ],
    };
  }

  /**
   * fetches chart statistics
   */
  _fetchChartStatistics(): void {
    this.chartStatisticsData = [
      {
        title: "Target",
        stats: "$7.8k",
        icon: "fe-arrow-down",
        variant: "danger",
      },
      {
        title: "Last week",
        stats: "$1.4k",
        icon: "fe-arrow-up",
        variant: "success",
      },
      {
        title: "Last Month",
        stats: "$15k",
        icon: "fe-arrow-down",
        variant: "danger",
      },
    ];
  }

  /**
   * fetch users balance data
   */
  _fetchUserBalanceData(): void {
    this.userBalanceData = USERBALANCEDATA;
  }

  _fetchRevenueHistoryData(): void {
    this.revenueHistoryData = REVENUEHISTORYDATA;
  }
}
