import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UsuariosComponent } from "./usuarios/usuarios.component";
import { UsuariosRoutingModule } from "./usuarios-routing.module";


import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { VerUsuariosComponent } from "./ver-usuarios/ver-usuarios.component";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";

import { ContactsModule } from "src/app/apps/contacts/contacts.module";

@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsuariosRoutingModule,
    NgbPaginationModule,
    ContactsModule,
    UsuariosComponent, VerUsuariosComponent,
],
    exports: [UsuariosComponent],
})
export class UsuariosModule {}
