import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UsuariosComponent } from "./usuarios/usuarios.component";
import { UsuariosRoutingModule } from "./usuarios-routing.module";
import { PageTitleModule } from "src/app/shared/page-title/page-title.module";
import { AdvancedTableModule } from "src/app/shared/advanced-table/advanced-table.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { VerUsuariosComponent } from "./ver-usuarios/ver-usuarios.component";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { WidgetModule } from "src/app/shared/widget/widget.module";
import { ContactsModule } from "src/app/apps/contacts/contacts.module";

@NgModule({
  declarations: [UsuariosComponent, VerUsuariosComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageTitleModule,
    AdvancedTableModule,
    UsuariosRoutingModule,
    NgbPaginationModule,
    WidgetModule,
    ContactsModule,
  ],
  exports: [UsuariosComponent],
})
export class UsuariosModule {}
