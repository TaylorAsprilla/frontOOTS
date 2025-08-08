import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Error404twoComponent } from './error404two.component';

describe('Error404twoComponent', () => {
  let component: Error404twoComponent;
  let fixture: ComponentFixture<Error404twoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Error404twoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Error404twoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
