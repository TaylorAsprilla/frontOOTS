import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';
import { AdvancedTableComponent } from 'src/app/shared/advanced-table/advanced-table.component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { SortEvent } from 'src/app/shared/advanced-table/sortable.directive';
import { UsuarioInterface } from 'src/app/core/interface/usuario.interface';
import { usuarioData } from '../../../mocks/usuario.data';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbModalModule, PageTitleComponent, AdvancedTableComponent],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  records: UsuarioInterface[] = [];
  columns: Column[] = [];
  pageSizeOptions: number[] = [10, 25, 50, 100];
  formUsuario!: FormGroup;
  modalRef: NgbModalRef | undefined;

  @ViewChild('content', { static: true }) content: any;

  constructor(public activeModal: NgbModal, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.pageTitle = [
      { label: 'Usuarios', path: '/' },
      { label: 'Usuarios Registrados', path: '/', active: true },
    ];
    this._fetchData();
    this.initTableCofig();

    this.formUsuario = this.formBuilder.group({
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      celular: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get formularioUsuario() {
    return this.formUsuario.controls;
  }

  /**
   * fetches table records
   */
  _fetchData(): void {
    this.records = usuarioData;
  }

  /**
   * initialize advanced table columns
   */
  initTableCofig(): void {
    this.columns = [
      {
        name: 'primerNombre',
        label: 'Nombre',
        formatter: (record: UsuarioInterface) => record.primerNombre,
        width: 245,
      },
      {
        name: 'primerApellido',
        label: 'Apellido',
        formatter: (record: UsuarioInterface) => record.primerApellido,
        width: 245,
      },
      {
        name: 'email',
        label: 'Email',
        formatter: (record: UsuarioInterface) => record.email,
        width: 360,
      },
      {
        name: 'celular',
        label: 'Celular',
        formatter: (record: UsuarioInterface) => record.celular,
      },
      {
        name: 'ciudad',
        label: 'Ciudad',
        formatter: (record: UsuarioInterface) => record.ciudad,
        width: 180,
      },
      {
        name: 'direccion',
        label: 'Direccion',
        formatter: (record: UsuarioInterface) => record.direccion,
        width: 180,
      },
    ];
  }

  // compares two cell values
  compare(v1: string | number, v2: string | number): any {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  /**
   * Sort the table data
   * @param event column name, sort direction
   */
  onSort(event: SortEvent): void {
    if (event.direction === '') {
      this.records = usuarioData;
    } else {
      this.records = [...this.records].sort((a, b) => {
        const res = this.compare(a[event.column], b[event.column]);
        return event.direction === 'asc' ? res : -res;
      });
    }
  }

  /**
   * Match table data with search input
   * @param row Table row
   * @param term Search the value
   */
  matches(row: UsuarioInterface, term: string) {
    return (
      row.primerNombre.toLowerCase().includes(term) ||
      row.primerApellido.toLowerCase().includes(term) ||
      row.celular.toLowerCase().includes(term) ||
      row.direccion.toLowerCase().includes(term) ||
      row.email.toLowerCase().includes(term)
    );
  }

  /**
   * Search Method
   */
  searchData(searchTerm: string): void {
    if (searchTerm === '') {
      this._fetchData();
    } else {
      let updatedData = usuarioData;

      //  filter
      updatedData = updatedData.filter((record) => this.matches(record, searchTerm));
      this.records = updatedData;
    }
  }

  crearUsuario() {
    if (this.formUsuario.valid) {
      const data: UsuarioInterface = this.formUsuario.value;
      console.log('Usuarios,', data);

      this.records.push(data);

      console.log(this.records);

      this.cerrarModal();
      this.clearFormulario();
    }
  }

  clearFormulario() {
    this.formUsuario.reset();
  }

  openModal(): void {
    this.modalRef = this.activeModal.open(this.content, { centered: true });
  }

  cerrarModal(): void {
    if (this.modalRef) {
      this.modalRef.dismiss();
    }
  }
}
