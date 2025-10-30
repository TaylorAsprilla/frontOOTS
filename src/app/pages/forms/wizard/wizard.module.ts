import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { WizardRoutingModule } from './wizard-routing.module';
import { WizardComponent } from './wizard.component';



@NgModule({
    imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbProgressbarModule,
    NgbNavModule,
    WizardRoutingModule,
    WizardComponent
]
})
export class WizardModule { }
