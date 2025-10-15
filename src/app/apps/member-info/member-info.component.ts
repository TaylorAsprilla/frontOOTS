import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserInfoInterface } from 'src/app/core/interface/user.interface';

@Component({
  selector: 'app-contact-member-info',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './member-info.component.html',
  styleUrls: ['./member-info.component.scss'],
})
export class MemberInfoComponent implements OnInit {
  @Input() user: UserInfoInterface = {
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    email: '',
    celular: '',
    foto: 'assets/images/users/avatar-1.jpg',
    cargo: 'Sin cargo',
    participantes: 0,
    casos: 0,
    proximasCitas: 0,
  };

  constructor() {}

  ngOnInit(): void {
    // Aplicar valores por defecto si no se proporcionan
    this.user = {
      ...this.user,
      foto: this.user.foto || 'assets/images/users/avatar-1.jpg',
      cargo: this.user.cargo || 'Sin cargo',
      participantes: this.user.participantes || 0,
      casos: this.user.casos || 0,
      proximasCitas: this.user.proximasCitas || 0,
    };
  }

  /**
   * Obtiene el nombre completo del usuario
   */
  get nombreCompleto(): string {
    const nombre = `${this.user.primerNombre || ''} ${this.user.segundoNombre || ''}`.trim();
    const apellido = `${this.user.primerApellido || ''} ${this.user.segundoApellido || ''}`.trim();
    return `${nombre} ${apellido}`.trim() || 'Usuario sin nombre';
  }
}
