import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedVideoComponent } from './featured-video.component';

describe('FeaturedVideoComponent', () => {
  let component: FeaturedVideoComponent;
  let fixture: ComponentFixture<FeaturedVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeaturedVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
