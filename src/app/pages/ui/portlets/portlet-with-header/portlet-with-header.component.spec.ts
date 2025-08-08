import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortletWithHeaderComponent } from './portlet-with-header.component';

describe('PortletWithHeaderComponent', () => {
  let component: PortletWithHeaderComponent;
  let fixture: ComponentFixture<PortletWithHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortletWithHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortletWithHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
