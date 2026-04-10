import { Component, Injectable, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LocalizedDatePipe } from 'src/app/core/pipes/localized-date.pipe';
import { StatisticsCardComponent } from 'src/app/shared/widget/statistics-card/statistics-card.component';
import { NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { StatisticsCard1 } from 'src/app/shared/widget/statistics-card/statistics-card.model';
import { ChartOptions } from '../../charts/apex/apex-chart.model';
import { RevenueHistory, UserBalance } from './dashboard-one.model';
import { REVENUEHISTORYDATA, USERBALANCEDATA } from './data';
import { ParticipantService } from 'src/app/core/services/participant.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { CaseService } from 'src/app/core/services/case.service';
import { Subject, takeUntil, forkJoin } from 'rxjs';

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly month_list = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  readonly DELIMITER = ' ';

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
    return date ? this.month_list[date.month - 1] + this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-dashboard-one',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgApexchartsModule,
    StatisticsCardComponent,
    TranslocoModule,
    LocalizedDatePipe,
  ],
  templateUrl: './dashboard-one.component.html',
  styleUrls: ['./dashboard-one.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }],
})
export class DashboardOneComponent implements OnInit, OnDestroy {
  private readonly participantService = inject(ParticipantService);
  private readonly authService = inject(AuthenticationService);
  private readonly caseService = inject(CaseService);
  private readonly calendar = inject(NgbCalendar);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  statisticsCardData: StatisticsCard1[] = [];
  revenuChart!: Partial<ChartOptions>;
  salesAnalyticsChart!: Partial<ChartOptions>;
  casesByStatusChart!: Partial<ChartOptions>;
  userBalanceData: UserBalance[] = [];
  revenueHistoryData: RevenueHistory[] = [];
  totalParticipants: number = 0;
  totalCases: number = 0;
  openCases: number = 0;
  closedCases: number = 0;
  pendingFollowUps: number = 0;
  recentParticipants: any[] = [];
  recentCases: any[] = [];
  casesByMonth: { [key: string]: number } = {};
  closedCasesByMonth: { [key: string]: number } = {};
  currentYear: number = new Date().getFullYear();
  isFiltered: boolean = false;

  date!: NgbDateStruct;

  private allCases: any[] = [];
  private allParticipants: any[] = [];

  ngOnInit(): void {
    this.date = this.calendar.getToday();
    this.initChart();
    this.updateCasesByStatusChart(); // Initialize with zeros
    this._fetchUserBalanceData();
    this._fetchRevenueHistoryData();
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all dashboard data (participants and cases)
   */
  loadDashboardData(): void {
    const currentUser = this.authService.currentUser();

    if (!currentUser || !currentUser.id) {
      return;
    }

    // Load participants and cases in parallel
    forkJoin({
      participants: this.participantService.getParticipantsByUser(currentUser.id),
      cases: this.caseService.getCasesByUserId(currentUser.id),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.allParticipants = response.participants?.data?.participants || [];
          this.allCases = response.cases?.cases || [];
          this.isFiltered = false;
          this.applyStats(this.allCases, this.allParticipants);
        },
        error: (error) => {
          console.error('Error loading dashboard data:', error);
          // Initialize with empty data in case of error
          this._updateStatisticsCards();
        },
      });
  }

  /**
   * Apply statistics for a given subset of cases and participants
   */
  private applyStats(cases: any[], participants: any[]): void {
    this.totalParticipants = participants.length;
    this.totalCases = cases.length;

    this.recentParticipants = [...participants]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    this.recentCases = [...cases]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    this.openCases = cases.filter((c) => {
      const s = (c.status || '').toLowerCase().replace(/[-\s]/g, '_');
      return s === 'in_progress' || s === 'active' || s === 'open';
    }).length;

    this.closedCases = cases.filter((c) => {
      const s = (c.status || '').toLowerCase().replace(/[-\s]/g, '_');
      return s === 'closed';
    }).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.pendingFollowUps = cases.filter((c: any) => {
      const status = (c.status || '').toLowerCase().replace(/[-\s]/g, '_');
      if (status === 'closed') return false;
      const plans: any[] = c.followUpPlans ?? c.followUpPlan ?? [];
      return plans.some((p: any) => {
        if (!p?.appointmentDate) return false;
        const apptDate = new Date(p.appointmentDate);
        apptDate.setHours(0, 0, 0, 0);
        return apptDate <= today;
      });
    }).length;

    this.processCasesByMonth(cases);
    this._updateStatisticsCards();
  }

  /**
   * Filter dashboard data by the selected month/year in the datepicker
   */
  applyDateFilter(): void {
    if (!this.date) return;
    const filteredCases = this.allCases.filter((c) => {
      const d = new Date(c.createdAt);
      return d.getFullYear() === this.date.year && d.getMonth() + 1 === this.date.month;
    });
    const filteredParticipants = this.allParticipants.filter((p) => {
      const d = new Date(p.createdAt);
      return d.getFullYear() === this.date.year && d.getMonth() + 1 === this.date.month;
    });
    this.isFiltered = true;
    this.applyStats(filteredCases, filteredParticipants);
  }

  /**
   * Reset date filter back to all data
   */
  resetDateFilter(): void {
    this.date = this.calendar.getToday();
    this.isFiltered = false;
    this.applyStats(this.allCases, this.allParticipants);
  }

  /**
   * Update all statistics cards with real data
   */
  _updateStatisticsCards(): void {
    // Create/Update statistics cards with real data from APIs
    this.statisticsCardData = [
      {
        id: 1,
        variant: 'primary',
        description: 'dashboard.stats.participants',
        icon: 'fe-heart',
        stats: this.totalParticipants,
        options: {
          prefix: '',
          duration: 2,
        },
      },
      {
        id: 2,
        variant: 'success',
        description: 'dashboard.stats.openCases',
        icon: 'fe-user',
        stats: this.openCases,
        options: {
          duration: 2,
        },
      },
      {
        id: 3,
        variant: 'info',
        description: 'dashboard.stats.closedCases',
        icon: 'fe-bar-chart-line',
        stats: this.closedCases,
        options: {
          duration: 2,
        },
      },
      {
        id: 4,
        variant: 'warning',
        description: 'dashboard.stats.followUps',
        icon: 'fe-eye',
        stats: this.pendingFollowUps,
        options: {
          duration: 2,
        },
      },
    ];

    // Update total cases in radial chart
    this.updateRevenuChart();

    // Update sales analytics chart
    this.updateSalesAnalyticsChart();

    // Update cases-by-status donut chart
    this.updateCasesByStatusChart();
  }

  /**
   * Process cases by month for chart visualization
   */
  processCasesByMonth(cases: any[]): void {
    // Get current year
    const currentYear = new Date().getFullYear();

    // Initialize months (last 12 months)
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    // Reset counters
    this.casesByMonth = {};
    this.closedCasesByMonth = {};

    months.forEach((month) => {
      const key = `${currentYear}-${month}`;
      this.casesByMonth[key] = 0;
      this.closedCasesByMonth[key] = 0;
    });

    // Count cases by month
    cases.forEach((caseItem) => {
      const createdDate = new Date(caseItem.createdAt);
      const monthKey = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;

      if (createdDate.getFullYear() === currentYear) {
        this.casesByMonth[monthKey] = (this.casesByMonth[monthKey] || 0) + 1;

        if (caseItem.status === 'closed') {
          this.closedCasesByMonth[monthKey] = (this.closedCasesByMonth[monthKey] || 0) + 1;
        }
      }
    });
  }

  /**
   * Update sales analytics chart with real data
   */
  updateSalesAnalyticsChart(): void {
    const currentYear = new Date().getFullYear();
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    // Prepare data for chart
    const totalCasesData: number[] = [];
    const closedCasesData: number[] = [];

    months.forEach((month) => {
      const key = `${currentYear}-${month}`;
      totalCasesData.push(this.casesByMonth[key] || 0);
      closedCasesData.push(this.closedCasesByMonth[key] || 0);
    });

    // Update chart series
    this.salesAnalyticsChart.series = [
      {
        name: 'Total de Casos',
        type: 'column',
        data: totalCasesData,
      },
      {
        name: 'Casos Cerrados',
        type: 'line',
        data: closedCasesData,
      },
    ];

    // Labels remain the same (already set in initialization)
    this.salesAnalyticsChart.labels = monthNames;
  }

  /**
   * Update revenue chart with total cases
   */
  updateRevenuChart(): void {
    if (this.totalParticipants > 0) {
      // Calcular el porcentaje de participantes que tienen casos
      const percentage = Math.round((this.totalCases / this.totalParticipants) * 100);
      this.revenuChart.series = [percentage > 100 ? 100 : percentage];
      // Actualizar la etiqueta del gráfico
      this.revenuChart.labels = ['Casos vs Participantes'];
    } else {
      this.revenuChart.series = [0];
      this.revenuChart.labels = ['Casos vs Participantes'];
    }
  }

  /**
   * Load participants count for the current user
   * @deprecated Use loadDashboardData instead
   */
  loadParticipantsCount(): void {
    const currentUser = this.authService.currentUser();

    if (!currentUser || !currentUser.id) {
      return;
    }

    this.participantService
      .getParticipantsByUser(currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.totalParticipants = response.data.total;
          // Actualizar la tarjeta de estadísticas de participantes
          this._updateParticipantsCard();
        },
        error: (error) => {
          console.error('Error loading participants count:', error);
        },
      });
  }

  /**
   * Update participants statistics card with real data
   * @deprecated Use _updateStatisticsCards instead
   */
  _updateParticipantsCard(): void {
    const participantsCard = this.statisticsCardData.find((card) => card.id === 1);
    if (participantsCard) {
      participantsCard.stats = this.totalParticipants;
    }
  }

  /**
   * Get status badge class for cases
   */
  getCaseStatusClass(status: string): string {
    switch (status) {
      case 'in_progress':
      case 'active':
      case 'open':
        return 'badge bg-soft-warning text-warning';
      case 'closed':
        return 'badge bg-soft-success text-success';
      case 'transferred':
        return 'badge bg-soft-info text-info';
      case 'suspended':
        return 'badge bg-soft-danger text-danger';
      default:
        return 'badge bg-soft-secondary text-secondary';
    }
  }

  /**
   * Get status label in Spanish
   */
  getCaseStatusLabel(status: string): string {
    switch (status) {
      case 'in_progress':
        return 'En Progreso';
      case 'active':
        return 'Activo';
      case 'open':
        return 'Abierto';
      case 'closed':
        return 'Cerrado';
      case 'transferred':
        return 'Transferido';
      case 'suspended':
        return 'Suspendido';
      default:
        return 'Desconocido';
    }
  }

  /**
   * Get initials from full name for avatar
   */
  getInitials(fullName: string): string {
    if (!fullName) return '??';
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  }

  /**
   * Navigate to participant detail view
   */
  viewParticipant(participant: any): void {
    if (participant.id) {
      this.router.navigate(['/participants/detail', participant.id]);
    }
  }

  /**
   * Update cases-by-status donut chart with real data
   */
  updateCasesByStatusChart(): void {
    const openCount = this.openCases;
    const closedCount = this.closedCases;
    const otherCount = this.totalCases - openCount - closedCount;

    this.casesByStatusChart = {
      series: [openCount, closedCount, otherCount > 0 ? otherCount : 0],
      chart: {
        height: 240,
        type: 'donut',
      },
      labels: ['Abiertos / En Progreso', 'Cerrados', 'Otros'],
      colors: ['#1abc9c', '#4a81d4', '#f7b731'],
      legend: {
        position: 'bottom',
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${Math.round(val)}%`,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
          },
        },
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            chart: { height: 200 },
            legend: { show: false },
          },
        },
      ],
    };
  }

  /**
   * initialize charts
   */
  initChart(): void {
    this.revenuChart = {
      series: [68],
      chart: {
        height: 242,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '65%',
          },
        },
      },
      colors: ['#f86262'],
      labels: ['Revenue'],
    };

    this.salesAnalyticsChart = {
      series: [
        {
          name: 'Total de Casos',
          type: 'column',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: 'Casos Cerrados',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
      chart: {
        height: 378,
        type: 'line',
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
          columnWidth: '50%',
        },
      },
      colors: ['#1abc9c', '#4a81d4'],
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      xaxis: {
        type: 'category',
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
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
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
            text: 'Total de Casos',
          },
        },
        {
          opposite: true,
          title: {
            text: 'Casos Cerrados',
          },
        },
      ],
    };
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
