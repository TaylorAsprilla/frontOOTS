import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UsuariosComponent } from "./usuarios/usuarios.component";
import { VerUsuariosComponent } from "./ver-usuarios/ver-usuarios.component";

const routes: Routes = [
  { path: "", component: UsuariosComponent },
  { path: "ver-usuarios", component: VerUsuariosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosRoutingModule {}
