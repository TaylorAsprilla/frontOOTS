import { Component, OnInit, ViewChild, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';
import { AdvancedTableComponent } from 'src/app/shared/advanced-table/advanced-table.component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { SortEvent } from 'src/app/shared/advanced-table/sortable.directive';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UserModel, CreateUserRequest } from '../../../core/models/user.model';
import { UserInterface } from '../../../core/interface/user.interface';
import { ContactsModule } from 'src/app/apps/contacts/contacts.module';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModalModule,
    TranslocoModule,
    PageTitleComponent,
    AdvancedTableComponent,
    NgbPaginationModule,
    ContactsModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  // Inyección de dependencias usando inject()
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);
  private readonly activeModal = inject(NgbModal);
  private readonly router = inject(Router);
  private destroy$ = new Subject<void>();

  pageTitle: BreadcrumbItem[] = [];
  records: UserInterface[] = []; // Usuarios mapeados para la tabla
  columns: Column[] = [];
  pageSizeOptions: number[] = [10, 25, 50, 100];
  formUsuario!: FormGroup;
  modalRef: NgbModalRef | undefined;
  loading = false;
  loadingModal = false;
  loadingUsers = false; // Estado de loading específico para la carga de usuarios
  errorLoadingUsers = false; // Estado de error para la carga de usuarios

  @ViewChild('content', { static: true }) content: any;

  ngOnInit(): void {
    this.pageTitle = [
      { label: 'User Management', path: '/user-management' },
      { label: 'Users List', path: '/user-management/list', active: true },
    ];
    this.initTableConfig();
    this.loadUsers(); // Load real data from backend only
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Navigation methods for scalable routing
  navigateToCreate(): void {
    this.router.navigate(['/users/create']);
  }

  navigateToDetails(): void {
    this.router.navigate(['/users/details']);
  }

  navigateToSettings(): void {
    this.router.navigate(['/user-management/settings']);
  }

  navigateToProfile(userId: number): void {
    this.router.navigate(['/user-management/profile', userId]);
  }

  navigateToEdit(userId: number): void {
    this.router.navigate(['/user-management/edit', userId]);
  }

  /**
   * Carga usuarios desde el backend con manejo completo de estados
   */
  loadUsers(page: number = 1, limit: number = 100): void {
    this.loadingUsers = true;
    this.errorLoadingUsers = false;

    this.userService
      .getUsers(page, limit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users: UserModel[]) => {
          this.loadingUsers = false;

          // Convertir los usuarios del backend al formato esperado por la tabla
          this.records = users.map(
            (user: UserModel) =>
              ({
                firstName: user.firstName,
                secondName: user.secondName || '',
                firstLastName: user.firstLastName,
                secondLastName: user.secondLastName || '',
                phoneNumber: user.phoneNumber,
                email: user.email,
                password: '', // No mostrar la contraseña por seguridad
                documentNumber: user.documentNumber,
                address: user.address,
                city: user.city,
                birthDate: user.birthDate instanceof Date ? user.birthDate.toISOString().split('T')[0] : user.birthDate,
              } as UserInterface)
          );

          // Show success notification only if we have users
          if (users.length > 0) {
            this.notificationService.showSuccess(`${users.length} usuarios cargados exitosamente`, {
              title: 'Datos actualizados',
              timer: 2000,
            });
          } else {
            this.notificationService.showInfo('No se encontraron usuarios en el sistema', {
              title: 'Sin datos',
              timer: 3000,
            });
          }
        },
        error: (error) => {
          this.loadingUsers = false;
          this.errorLoadingUsers = true;

          // Show detailed error message based on error type
          let errorTitle = 'Error al cargar usuarios';
          let errorMessage = 'No se pudieron cargar los usuarios del servidor';

          if (error.status === 0) {
            errorTitle = 'Sin conexión';
            errorMessage = 'No se puede conectar al servidor. Verifica tu conexión a internet.';
          } else if (error.status === 404) {
            errorTitle = 'Servicio no encontrado';
            errorMessage = 'El servicio de usuarios no está disponible.';
          } else if (error.status === 500) {
            errorTitle = 'Error del servidor';
            errorMessage = 'Error interno del servidor. Intenta más tarde.';
          }

          this.notificationService.showError(errorMessage, {
            title: errorTitle,
            timer: 0,
            showConfirmButton: true,
          });

          // Clear records on error
          this.records = [];
        },
      });
  }

  /**
   * Recarga los usuarios desde el backend
   */
  refreshUsers(): void {
    this.loadUsers();
  }

  /**
   * Initialize advanced table columns configuration
   */
  initTableConfig(): void {
    this.columns = [
      {
        name: 'firstName',
        label: 'Nombre',
        formatter: (record: UserInterface) => record.firstName || '',
        width: 200,
        sort: true,
      },
      {
        name: 'firstLastName',
        label: 'Apellido',
        formatter: (record: UserInterface) => record.firstLastName || '',
        width: 200,
        sort: true,
      },
      {
        name: 'email',
        label: 'Email',
        formatter: (record: UserInterface) => record.email || '',
        width: 280,
        sort: true,
      },
      {
        name: 'phoneNumber',
        label: 'Celular',
        formatter: (record: UserInterface) => record.phoneNumber || '',
        width: 140,
        sort: false,
      },
      {
        name: 'city',
        label: 'Ciudad',
        formatter: (record: UserInterface) => record.city || '',
        width: 150,
        sort: true,
      },
      {
        name: 'address',
        label: 'Dirección',
        formatter: (record: UserInterface) => record.address || '',
        width: 180,
        sort: false,
      },
      {
        name: 'actions',
        label: 'Acciones',
        formatter: () => '', // Actions will be handled in template
        width: 120,
        sort: false,
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
  onSort(event: SortEvent) {
    if (event.direction === '' || event.column === '') {
      // Reset to original order - reload from backend
      this.loadUsers();
    } else {
      // Sort current records
      this.records = [...this.records].sort((a, b) => {
        const res = this.compare((a as any)[event.column], (b as any)[event.column]);
        return event.direction === 'asc' ? res : -res;
      });
    }
  }

  /**
   * Match table data with search input
   * @param row Table row
   * @param term Search the value
   */
  matches(row: UserInterface, term: string) {
    return (
      row.firstName.toLowerCase().includes(term) ||
      row.firstLastName.toLowerCase().includes(term) ||
      row.phoneNumber.toLowerCase().includes(term) ||
      row.address.toLowerCase().includes(term) ||
      row.email.toLowerCase().includes(term) ||
      row.city.toLowerCase().includes(term)
    );
  }

  /**
   * Search Method - filters current loaded data
   */
  searchData(searchTerm: string): void {
    if (searchTerm === '') {
      // Reset search - reload from backend
      this.loadUsers();
    } else {
      // Filter current records
      const allRecords = [...this.records];
      this.records = allRecords.filter((record: UserInterface) => this.matches(record, searchTerm));
    }
  }

  /**
   * Crea un nuevo usuario utilizando el servicio
   */
  crearUsuario(): void {
    if (this.formUsuario.valid) {
      this.loadingModal = true;

      // Mapear los datos del formulario al formato requerido por el backend
      const createUserRequest: CreateUserRequest = {
        firstName: this.formUsuario.get('firstName')?.value,
        secondName: this.formUsuario.get('secondName')?.value || '',
        firstLastName: this.formUsuario.get('firstLastName')?.value,
        secondLastName: this.formUsuario.get('secondLastName')?.value || '',
        phoneNumber: this.formUsuario.get('phoneNumber')?.value,
        email: this.formUsuario.get('email')?.value,
        password: this.formUsuario.get('password')?.value,
        documentNumber: this.formUsuario.get('documentNumber')?.value,
        address: this.formUsuario.get('address')?.value,
        city: this.formUsuario.get('city')?.value,
        birthDate: this.formUsuario.get('birthDate')?.value,
      };

      this.userService
        .createUser(createUserRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (user: UserModel) => {
            this.loadingModal = false;

            // Mostrar notificación de éxito con SweetAlert2
            this.notificationService.showSuccess('Usuario creado exitosamente', {
              title: '¡Éxito!',
              text: `${user.firstName} ${user.firstLastName} ha sido registrado correctamente.`,
              timer: 3000,
            });

            // Cerrar modal, limpiar formulario y refrescar tabla
            this.cerrarModal();
            this.clearFormulario();
            this.loadUsers(); // Refresh users from backend after creation
          },
          error: (error) => {
            this.loadingModal = false;
            console.error('Error al crear usuario:', error);
          },
        });
    } else {
      this.notificationService.showWarning('Por favor, completa todos los campos requeridos correctamente.', {
        title: 'Formulario incompleto',
        timer: 4000,
      });
      this.markFormGroupTouched(this.formUsuario);
    }
  }

  /**
   * Limpia el formulario
   */
  clearFormulario(): void {
    this.formUsuario.reset();
  }

  /**
   * Marca todos los campos del formulario como tocados para mostrar errores de validación
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
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
