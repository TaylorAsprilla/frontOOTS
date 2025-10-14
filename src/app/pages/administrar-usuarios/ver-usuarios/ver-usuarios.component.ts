import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';
import { MemberInfoComponent } from 'src/app/apps/member-info/member-info.component';
import { FormGroup } from '@angular/forms';
import { UsuarioInfoInterface } from 'src/app/core/interface/usuario.interface';
import { LISTA_USUARIOS } from 'src/app/mocks/info-usuario.data';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-ver-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPaginationModule, PageTitleComponent, MemberInfoComponent],
  templateUrl: './ver-usuarios.component.html',
  styleUrls: ['./ver-usuarios.component.scss'],
})
export class VerUsuariosComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  listaDeUsuarios: UsuarioInfoInterface[] = [];
  searchTerm: string = '';
  page = 1;

  constructor() {}

  ngOnInit(): void {
    this.pageTitle = [
      { label: 'Usuarios', path: '/' },
      { label: 'Información de Usuarios', path: '/', active: true },
    ];
    this._fetchData();
  }

  _fetchData(): void {
    this.listaDeUsuarios = LISTA_USUARIOS;
  }

  searchData(searchTerm: string): void {
    if (searchTerm === '') {
      this._fetchData();
    } else {
      let updatedData = LISTA_USUARIOS;
      //  filter
      updatedData = updatedData.filter(
        (usuario) =>
          usuario.primerApellido?.toLowerCase().includes(searchTerm) ||
          usuario.segundoNombre?.toLowerCase().includes(searchTerm) ||
          usuario.primerApellido?.toLowerCase().includes(searchTerm) ||
          usuario.segundoApellido?.toLowerCase().includes(searchTerm) ||
          usuario.numeroDocumento?.toLowerCase().includes(searchTerm)
      );
      this.listaDeUsuarios = updatedData;
    }
  }
}
