import { ComponentFixture, TestBed } from '@angular/core/testing';

import { widgetFaqComponent } from './widgetFaq.component';

describe('FaqComponent', () => {
  let component: widgetFaqComponent;
  let fixture: ComponentFixture<widgetFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [widgetFaqComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(widgetFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
