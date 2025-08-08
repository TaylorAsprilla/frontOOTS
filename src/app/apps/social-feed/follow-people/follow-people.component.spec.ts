import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowPeopleComponent } from './follow-people.component';

describe('FollowPeopleComponent', () => {
  let component: FollowPeopleComponent;
  let fixture: ComponentFixture<FollowPeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowPeopleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
