import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardOneComponent } from './dashboard-one.component';
import { ParticipantService } from '../../../core/services/participant.service';
import { CaseService } from '../../../core/services/case.service';
import { AuthenticationService } from '../../../core/services/auth.service';

describe('Cases by status summary', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardOneComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: {} },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
          preloadLangs: true,
        }),
      ],
      providers: [
        provideRouter([]),
        { provide: ParticipantService, useValue: {} },
        { provide: CaseService, useValue: {} },
        { provide: AuthenticationService, useValue: {} },
      ],
    }).overrideComponent(DashboardOneComponent, {
      remove: { imports: [NgApexchartsModule] },
      add: { schemas: [NO_ERRORS_SCHEMA] },
    }).compileComponents();
    spyOn(DashboardOneComponent.prototype, 'ngOnInit');
  });

  it('shows the total and counts with percentages matching the donut series', () => {
    const fixture = TestBed.createComponent(DashboardOneComponent);
    const component = fixture.componentInstance;
    component.initChart();
    component.totalCases = 100;
    component.openCases = 72;
    component.closedCases = 28;
    component.updateCasesByStatusChart();
    fixture.detectChanges();
    expect(component.caseStatusSummary.map((item) => item.count)).toEqual([72, 28, 0]);
    expect(component.caseStatusSummary.map((item) => item.percentage)).toEqual([72, 28, 0]);
    expect(component.casesByStatusChart.series).toEqual([72, 28, 0]);
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.case-status-total strong')?.textContent).toBe('100');
    expect(element.querySelectorAll('.case-status-summary li').length).toBe(3);
    expect(element.querySelector('.case-status-values')?.textContent).toContain('72%');
    component.totalCases = 4;
    component.openCases = 1;
    component.closedCases = 1;
    component.updateCasesByStatusChart();
    fixture.detectChanges();
    expect(component.caseStatusSummary.map((item) => item.percentage)).toEqual([25, 25, 50]);
    expect(element.querySelector('.case-status-total strong')?.textContent).toBe('4');
  });

  it('avoids invalid percentages and keeps the empty state when no cases exist', () => {
    const fixture = TestBed.createComponent(DashboardOneComponent);
    fixture.componentInstance.initChart();
    fixture.componentInstance.updateCasesByStatusChart();
    fixture.detectChanges();
    expect(fixture.componentInstance.caseStatusSummary.map((item) => item.percentage)).toEqual([0, 0, 0]);
    expect(fixture.nativeElement.querySelector('.case-status-total')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('dashboard.charts.noData');
  });

  it('renders the average without a percentage or cap and updates when totals change', () => {
    const fixture = TestBed.createComponent(DashboardOneComponent);
    const component = fixture.componentInstance;
    component.initChart();
    component.updateCasesByStatusChart();
    component.totalParticipants = 100;
    component.totalCases = 150;
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(component.averageCasesPerParticipant).toBe(1.5);
    expect(element.querySelector('.participant-average-value')?.textContent?.trim()).toBe('1.50');
    expect(element.textContent).not.toContain('dashboard.tables.recentParticipants');
    expect(element.textContent).toContain('dashboard.tables.recentCasesTitle');
    expect(element.querySelector('.participant-average')?.textContent).not.toContain('%');
    component.totalParticipants = 3;
    component.totalCases = 1;
    fixture.detectChanges();
    expect(element.querySelector('.participant-average-value')?.textContent?.trim()).toBe('0.33');
    component.totalCases = 0;
    fixture.detectChanges();
    expect(element.querySelector('.participant-average-value')?.textContent?.trim()).toBe('0.00');
    component.totalParticipants = 0;
    fixture.detectChanges();
    expect(component.averageCasesPerParticipant).toBeNull();
    expect(element.querySelector('.participant-average-value')?.textContent?.trim()).toBe('—');
    expect(element.querySelector('.participant-average')?.textContent).toContain('dashboard.charts.averageUnavailable');
  });
});
