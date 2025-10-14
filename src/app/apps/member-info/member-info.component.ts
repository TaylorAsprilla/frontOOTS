import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MemberInfo } from '../contacts/shared/contacts.model';
import { UsuarioInfoInterface } from 'src/app/core/interface/usuario.interface';

@Component({
  selector: 'app-contact-member-info',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './member-info.component.html',
  styleUrls: ['./member-info.component.scss'],
})
export class MemberInfoComponent implements OnInit {
  @Input() usuario: UsuarioInfoInterface = {};

  constructor() {}

  ngOnInit(): void {}
}
