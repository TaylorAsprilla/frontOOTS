import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CrearParticipanteComponent } from "./crear-participante/crear-participante.component";
import { ParticipantesRoutingModule } from "./participantes-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbNavModule, NgbProgressbarModule } from "@ng-bootstrap/ng-bootstrap";

import { WizardRoutingModule } from "../forms/wizard/wizard-routing.module";

@NgModule({
    imports: [
    CommonModule,
    ParticipantesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbProgressbarModule,
    NgbNavModule,
    WizardRoutingModule,
    CrearParticipanteComponent,
],
    exports: [CrearParticipanteComponent],
})
export class ParticipantesModule {}
