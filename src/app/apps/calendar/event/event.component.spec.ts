import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarEventComponent } from './event.component';

describe('CalendarEventComponent', () => {
  let component: CalendarEventComponent;
  let fixture: ComponentFixture<CalendarEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CalendarEventComponent]
})
    .overrideComponent(CalendarEventComponent, {
      add: { imports: [CommonModule, FormsModule] }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
