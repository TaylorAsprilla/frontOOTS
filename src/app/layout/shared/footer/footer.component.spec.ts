import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FooterComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps the copyright without placeholder navigation links', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain(`${new Date().getFullYear()} © OOTS`);
    expect(element.querySelectorAll('a').length).toBe(0);
  });
});
