import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundedProgressChartComponent } from './rounded-progress-chart.component';

describe('RoundedProgressChartComponent', () => {
  let component: RoundedProgressChartComponent;
  let fixture: ComponentFixture<RoundedProgressChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundedProgressChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundedProgressChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
