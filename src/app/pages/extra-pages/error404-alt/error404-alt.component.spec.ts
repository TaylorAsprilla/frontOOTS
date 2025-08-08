import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Error404AltComponent } from './error404-alt.component';

describe('Error404AltComponent', () => {
  let component: Error404AltComponent;
  let fixture: ComponentFixture<Error404AltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Error404AltComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Error404AltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
