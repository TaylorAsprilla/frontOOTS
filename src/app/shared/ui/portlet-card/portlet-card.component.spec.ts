import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortletCardComponent } from './portlet-card.component';

describe('PortletCardComponent', () => {
  let component: PortletCardComponent;
  let fixture: ComponentFixture<PortletCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PortletCardComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortletCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
