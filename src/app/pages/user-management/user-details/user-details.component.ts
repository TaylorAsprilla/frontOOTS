import { Component, OnInit, OnDestroy, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbPaginationModule, NgbModal, NgbModalRef, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule } from '@ngneat/transloco';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';
import { MemberInfoComponent } from 'src/app/apps/member-info/member-info.component';
import { UserInfoInterface } from 'src/app/core/interfaces/user.interface';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { UserService } from 'src/app/core/services/user.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UserModel } from 'src/app/core/models/user.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbPaginationModule,
    NgbModalModule,
    TranslocoModule,
    PageTitleComponent,
    MemberInfoComponent,
  ],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  private readonly modalService = inject(NgbModal);
  modalRef: NgbModalRef | null = null;
  selectedUser: UserInfoInterface | null = null;
  @ViewChild('userDetailsModal', { static: false }) userDetailsModal: any;
  // Open modal with user info
  openUserModal(user: UserInfoInterface): void {
    console.log('Ingresa');
    this.selectedUser = user;
    setTimeout(() => {
      this.modalRef = this.modalService.open(this.userDetailsModal, { centered: true });
    });
  }

  closeUserModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
    this.selectedUser = null;
  }
  // Inyección de dependencias usando inject()
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();

  pageTitle: BreadcrumbItem[] = [];
  listaDeUsuarios: UserInfoInterface[] = [];
  allUsers: UserInfoInterface[] = []; // Para mantener la lista completa para búsqueda
  searchTerm: string = '';
  page = 1;
  pageSize = 12; // 12 usuarios por página (4 columnas x 3 filas)
  totalUsers = 0;
  loading = false;
  error = false;

  // Array de avatares genéricos
  private readonly genericAvatars = [
    'assets/images/users/hombre-1.jpg',
    'assets/images/users/hombre-2.jpg',
    'assets/images/users/hombre-3.jpg',
    'assets/images/users/user-4.jpg',
    'assets/images/users/user-5.jpg',
    'assets/images/users/user-6.jpg',
    'assets/images/users/user-7.jpg',
    'assets/images/users/user-8.jpg',
  ];

  constructor() {}

  ngOnInit(): void {
    this.pageTitle = [
      { label: 'User Management', path: '/user-management' },
      { label: 'Users Directory', path: '/user-management/list', active: true },
    ];
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga usuarios desde el backend
   */
  loadUsers(): void {
    this.loading = true;
    this.error = false;

    this.userService
      .getUsers(1, 100) // Cargar todos los usuarios disponibles
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users: UserModel[]) => {
          this.loading = false;
          this.allUsers = this.mapUsersToUserInfo(users);
          this.updatePaginatedUsers();
          this.totalUsers = this.allUsers.length;

          if (users.length > 0) {
            this.notificationService.showSuccess(`${users.length} usuarios cargados exitosamente`, {
              title: 'Directorio actualizado',
              timer: 2000,
            });
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = true;
          console.error('Error loading users:', error);

          this.notificationService.showError('No se pudieron cargar los usuarios del servidor', {
            title: 'Error de conexión',
            timer: 0,
            showConfirmButton: true,
          });
        },
      });
  }

  /**
   * Mapea UserModel[] del backend a UserInfoInterface[] para el componente
   */
  private mapUsersToUserInfo(users: UserModel[]): UserInfoInterface[] {
    return users.map((user, index) => ({
      id: user.id,
      primerNombre: user.firstName,
      segundoNombre: user.secondName || '',
      primerApellido: user.firstLastName,
      segundoApellido: user.secondLastName || '',
      email: user.email,
      celular: user.phoneNumber,
      foto: this.getGenericAvatar(index),
      cargo: user.position || 'Sin cargo',
      ciudad: user.city || '',
      documentNumber: user.documentNumber,
      birthDate: user.birthDate instanceof Date ? user.birthDate.toISOString().substring(0, 10) : user.birthDate || '',
      address: user.address || '',
      participants: Math.floor(Math.random() * 50) + 1, // Estadísticas simuladas
      casos: Math.floor(Math.random() * 25) + 1,
      proximasCitas: Math.floor(Math.random() * 10) + 1,
    }));
  }

  /**
   * Obtiene un avatar genérico basado en el índice
   */
  private getGenericAvatar(index: number): string {
    return this.genericAvatars[index % this.genericAvatars.length];
  }

  /**
   * Genera un cargo aleatorio para los usuarios
   */
  private generateRandomPosition(): string {
    const positions = [
      'Desarrollador Frontend',
      'Desarrollador Backend',
      'Diseñador UX/UI',
      'Project Manager',
      'Quality Assurance',
      'DevOps Engineer',
      'Business Analyst',
      'Scrum Master',
      'Tech Lead',
      'Product Owner',
      'Data Analyst',
      'Marketing Specialist',
    ];
    return positions[Math.floor(Math.random() * positions.length)];
  }

  /**
   * Actualiza los usuarios paginados
   */
  updatePaginatedUsers(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.listaDeUsuarios = this.allUsers.slice(startIndex, endIndex);
  }

  /**
   * Maneja el cambio de página
   */
  onPageChange(newPage: number): void {
    this.page = newPage;
    this.updatePaginatedUsers();
  }

  /**
   * Búsqueda de usuarios
   */
  searchData(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase().trim();

    if (this.searchTerm === '') {
      // Mostrar todos los usuarios
      this.totalUsers = this.allUsers.length;
      this.page = 1;
      this.updatePaginatedUsers();
    } else {
      // Filtrar usuarios
      const filteredUsers = this.allUsers.filter(
        (usuario: UserInfoInterface) =>
          usuario.primerNombre?.toLowerCase().includes(this.searchTerm) ||
          usuario.segundoNombre?.toLowerCase().includes(this.searchTerm) ||
          usuario.primerApellido?.toLowerCase().includes(this.searchTerm) ||
          usuario.segundoApellido?.toLowerCase().includes(this.searchTerm) ||
          usuario.email?.toLowerCase().includes(this.searchTerm) ||
          usuario.celular?.toLowerCase().includes(this.searchTerm) ||
          usuario.cargo?.toLowerCase().includes(this.searchTerm)
      );

      this.totalUsers = filteredUsers.length;
      this.page = 1;

      // Paginar resultados filtrados
      const startIndex = (this.page - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.listaDeUsuarios = filteredUsers.slice(startIndex, endIndex);
    }
  }

  /**
   * Refresca los datos desde el backend
   */
  refreshUsers(): void {
    this.searchTerm = '';
    this.page = 1;
    this.loadUsers();
  }

  /**
   * Utilidad para Math.min en el template
   */
  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }
}
