import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoToneIconComponent } from './two-tone-icon.component';

describe('TwoToneIconComponent', () => {
  let component: TwoToneIconComponent;
  let fixture: ComponentFixture<TwoToneIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwoToneIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoToneIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
