import {
  Component,
  OnInit,
  ViewChild,
  inject,
  OnDestroy,
  AfterViewChecked,
  HostListener,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
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
import { UserInterface } from '../../../core/interfaces/user.interface';
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
export class UsersComponent implements OnInit, OnDestroy, AfterViewChecked {
  // Inyección de dependencias usando inject()
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);
  private readonly activeModal = inject(NgbModal);
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private destroy$ = new Subject<void>();
  private eventListeners: (() => void)[] = [];

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

  // Variables para el modal de información del usuario
  selectedUser: UserModel | null = null;
  loadingUserDetails = false;

  @ViewChild('content', { static: true }) content: any;
  @ViewChild('userDetailsModal', { static: true }) userDetailsModal: any;

  ngOnInit(): void {
    this.pageTitle = [
      { label: 'User Management', path: '/user-management' },
      { label: 'Users List', path: '/user-management/list', active: true },
    ];
    this.initTableConfig();
    this.loadUsers(); // Load real data from backend only

    // Exponer métodos globalmente para los botones de la tabla
    (window as any).viewUserDetails = (id: number) => this.viewUserDetails(id);
    (window as any).editUser = (id: number) => this.navigateToEdit(id);
    (window as any).deleteUser = (id: number) => this.confirmDeleteUser(id);

    // Suscribirse a cambios de idioma para actualizar columnas
    this.translocoService.langChanges$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.initTableConfig();
    });
  }

  ngOnDestroy(): void {
    // Limpiar event listeners
    this.removeActionButtonListeners();

    // Limpiar referencias globales
    delete (window as any).viewUserDetails;
    delete (window as any).editUser;
    delete (window as any).deleteUser;

    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewChecked(): void {
    // Agregar event listeners a los botones después de cada renderizado
    this.attachActionButtonListeners();
  }

  /**
   * Agrega event listeners a todos los botones de acción de la tabla
   */
  private attachActionButtonListeners(): void {
    // Limpiar listeners anteriores
    this.removeActionButtonListeners();

    // Buscar todos los botones con la clase user-action-btn
    const buttons = this.elementRef.nativeElement.querySelectorAll('.user-action-btn');

    buttons.forEach((button: HTMLElement) => {
      const unlisten = this.renderer.listen(button, 'click', (event: Event) => {
        event.preventDefault();
        event.stopPropagation();

        const action = button.getAttribute('data-action');
        const userId = button.getAttribute('data-user-id');

        if (userId) {
          const id = parseInt(userId, 10);

          switch (action) {
            case 'view':
              this.viewUserDetails(id);
              break;
            case 'edit':
              this.navigateToEdit(id);
              break;
            case 'delete':
              this.confirmDeleteUser(id);
              break;
          }
        }
      });

      // Guardar la función de limpieza
      this.eventListeners.push(unlisten);
    });
  }

  /**
   * Elimina todos los event listeners de los botones de acción
   */
  private removeActionButtonListeners(): void {
    this.eventListeners.forEach((unlisten) => unlisten());
    this.eventListeners = [];
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
                id: user.id, // Incluir ID para acciones
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
        name: 'fullName',
        label: this.translocoService.translate('user.fullName'),
        formatter: (record: UserInterface) => {
          const firstName = record.firstName || '';
          const secondName = record.secondName || '';
          const firstLastName = record.firstLastName || '';
          const secondLastName = record.secondLastName || '';

          return `${firstName} ${secondName} ${firstLastName} ${secondLastName}`.replace(/\s+/g, ' ').trim();
        },
        width: 280,
        sort: true,
      },
      {
        name: 'email',
        label: this.translocoService.translate('user.email'),
        formatter: (record: UserInterface) => record.email || '',
        width: 280,
        sort: true,
      },
      {
        name: 'phoneNumber',
        label: this.translocoService.translate('user.cellphone'),
        formatter: (record: UserInterface) => record.phoneNumber || '',
        width: 140,
        sort: false,
      },
      {
        name: 'city',
        label: this.translocoService.translate('user.city'),
        formatter: (record: UserInterface) => record.city || '',
        width: 150,
        sort: true,
      },
      {
        name: 'address',
        label: this.translocoService.translate('user.address'),
        formatter: (record: UserInterface) => record.address || '',
        width: 180,
        sort: false,
      },
      {
        name: 'actions',
        label: this.translocoService.translate('app.actions'),
        formatter: (record: UserInterface) => {
          return `
            <button 
              class="btn btn-sm btn-info me-1 user-action-btn" 
              data-action="view"
              data-user-id="${record.id}"
              title="${this.translocoService.translate('app.view')}"
            >
              <i class="mdi mdi-eye"></i>
            </button>
            <button 
              class="btn btn-sm btn-primary me-1 user-action-btn" 
              data-action="edit"
              data-user-id="${record.id}"
              title="${this.translocoService.translate('app.edit')}"
            >
              <i class="mdi mdi-pencil"></i>
            </button>
            <button 
              class="btn btn-sm btn-danger user-action-btn" 
              data-action="delete"
              data-user-id="${record.id}"
              title="${this.translocoService.translate('app.delete')}"
            >
              <i class="mdi mdi-delete"></i>
            </button>
          `;
        },
        width: 140,
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
        let aValue: any;
        let bValue: any;

        // Manejar el ordenamiento del nombre completo
        if (event.column === 'fullName') {
          aValue = `${a.firstName || ''} ${a.secondName || ''} ${a.firstLastName || ''} ${a.secondLastName || ''}`
            .replace(/\s+/g, ' ')
            .trim();
          bValue = `${b.firstName || ''} ${b.secondName || ''} ${b.firstLastName || ''} ${b.secondLastName || ''}`
            .replace(/\s+/g, ' ')
            .trim();
        } else {
          aValue = (a as any)[event.column];
          bValue = (b as any)[event.column];
        }

        const res = this.compare(aValue, bValue);
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
    const fullName = `${row.firstName} ${row.secondName || ''} ${row.firstLastName} ${
      row.secondLastName || ''
    }`.toLowerCase();
    const searchTerm = term.toLowerCase();

    return (
      fullName.includes(searchTerm) ||
      row.phoneNumber.toLowerCase().includes(searchTerm) ||
      row.address.toLowerCase().includes(searchTerm) ||
      row.email.toLowerCase().includes(searchTerm) ||
      row.city.toLowerCase().includes(searchTerm)
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

  /**
   * Abre el modal con la información detallada del usuario
   * @param userId - ID del usuario a visualizar
   */
  viewUserDetails(userId: number): void {
    this.loadingUserDetails = true;
    this.selectedUser = null;

    this.userService
      .getUserById(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user: UserModel) => {
          this.loadingUserDetails = false;
          this.selectedUser = user;

          // Abrir modal con la información
          this.modalRef = this.activeModal.open(this.userDetailsModal, {
            centered: true,
            size: 'lg',
            backdrop: 'static',
          });
        },
        error: (error) => {
          this.loadingUserDetails = false;
          console.error('Error al cargar detalles del usuario:', error);

          this.notificationService.showError('No se pudo cargar la información del usuario', {
            title: 'Error al cargar',
            timer: 3000,
          });
        },
      });
  }

  /**
   * Cierra el modal de detalles del usuario
   */
  closeUserDetailsModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
      this.selectedUser = null;
    }
  }

  /**
   * Obtiene el nombre completo del usuario seleccionado
   */
  getSelectedUserFullName(): string {
    return this.selectedUser ? this.selectedUser.getFullName() : '';
  }

  /**
   * Formatea la fecha de nacimiento del usuario
   */
  getFormattedBirthDate(): string {
    return this.selectedUser ? this.selectedUser.getFormattedBirthDate() : '';
  }

  /**
   * Obtiene la edad del usuario
   */
  getUserAge(): number | null {
    return this.selectedUser ? this.selectedUser.getAge() : null;
  }

  /**
   * Obtiene el teléfono formateado del usuario
   */
  getFormattedPhone(): string {
    return this.selectedUser ? this.selectedUser.getFormattedPhone() : '';
  }

  /**
   * Confirma y elimina un usuario
   * @param userId - ID del usuario a eliminar
   */
  confirmDeleteUser(userId: number): void {
    // Buscar el usuario en los registros para obtener su nombre
    const user = this.records.find((r) => r.id === userId);
    const userName = user ? `${user.firstName} ${user.firstLastName}` : 'este usuario';

    this.notificationService
      .showDeleteConfirmation(userName, {
        title: '⚠️ Confirmar eliminación',
        text: 'Esta acción no se puede deshacer',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.deleteUser(userId);
        }
      });
  }

  /**
   * Elimina un usuario del sistema
   * @param userId - ID del usuario a eliminar
   */
  private deleteUser(userId: number): void {
    this.userService
      .deleteUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Usuario eliminado exitosamente', {
            title: '✅ Eliminado',
            timer: 2000,
          });

          // Recargar la lista de usuarios
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);

          let errorMessage = 'No se pudo eliminar el usuario';
          if (error.status === 404) {
            errorMessage = 'Usuario no encontrado';
          } else if (error.status === 409) {
            errorMessage = 'No se puede eliminar el usuario porque tiene registros asociados';
          }

          this.notificationService.showError(errorMessage, {
            title: 'Error al eliminar',
            timer: 4000,
          });
        },
      });
  }
}
