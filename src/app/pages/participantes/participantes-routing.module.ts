import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CrearParticipanteComponent } from "./crear-participante/crear-participante.component";

const routes: Routes = [
  { path: "crear-participantes", component: CrearParticipanteComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParticipantesRoutingModule {}
