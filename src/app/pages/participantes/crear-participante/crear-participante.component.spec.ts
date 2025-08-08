import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearParticipanteComponent } from './crear-participante.component';

describe('CrearParticipanteComponent', () => {
  let component: CrearParticipanteComponent;
  let fixture: ComponentFixture<CrearParticipanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CrearParticipanteComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearParticipanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
