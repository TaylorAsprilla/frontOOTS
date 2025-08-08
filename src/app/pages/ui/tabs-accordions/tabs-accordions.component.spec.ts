import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsAccordionsComponent } from './tabs-accordions.component';

describe('TabsAccordionsComponent', () => {
  let component: TabsAccordionsComponent;
  let fixture: ComponentFixture<TabsAccordionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabsAccordionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsAccordionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
