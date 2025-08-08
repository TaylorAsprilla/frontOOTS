import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Error500twoComponent } from './error500two.component';

describe('Error500twoComponent', () => {
  let component: Error500twoComponent;
  let fixture: ComponentFixture<Error500twoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Error500twoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Error500twoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
