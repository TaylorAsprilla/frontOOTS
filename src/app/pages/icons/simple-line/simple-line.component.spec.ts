import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleLineComponent } from './simple-line.component';

describe('SimpleLineComponent', () => {
  let component: SimpleLineComponent;
  let fixture: ComponentFixture<SimpleLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SimpleLineComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
