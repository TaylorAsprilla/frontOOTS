import { TestBed } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CaseService } from '../../../core/services/case.service';
import { CasePdfService } from '../../../core/services/case-pdf.service';
import { ParticipantService } from '../../../core/services/participant.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { IdentifiedSituationService } from '../../../core/services/identified-situation.service';
import { CreateCaseComponent } from './create-case.component';

describe('Case follow-up validation notifications', () => {
  it('explains why the user cannot advance without a follow-up option', () => {
    const notifications = jasmine.createSpyObj<NotificationService>('NotificationService', ['showWarning']);
    const cases = jasmine.createSpyObj<CaseService>('CaseService', ['updateCase']);
    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: CaseService, useValue: cases },
        { provide: NotificationService, useValue: notifications },
        ...[CasePdfService, ParticipantService, TokenStorageService, IdentifiedSituationService, NgbModal, Router, ActivatedRoute]
          .map((provide) => ({ provide, useValue: {} })),
      ],
    });
    const component = TestBed.runInInjectionContext(() => new CreateCaseComponent());
    const builder = TestBed.inject(FormBuilder);
    component.caseForm = builder.group({
      followUpPlan: builder.group({ selectedOption: ['', Validators.required] }),
    });
    component.caseId = 33;
    component.activeWizardStep = 6;

    component.goToNextStep();

    expect(notifications.showWarning).toHaveBeenCalledOnceWith(
      'Seleccione una opción del plan de seguimiento y complete los campos requeridos antes de continuar.',
    );
    expect(component.caseForm.get('followUpPlan.selectedOption')?.touched).toBeTrue();
    expect(component.activeWizardStep).toBe(6);
    expect(cases.updateCase).not.toHaveBeenCalled();
    component.ngOnDestroy();
  });
});
