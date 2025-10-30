import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberInfo } from '../../shared/contacts.model';

@Component({
  selector: 'app-profile-userbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userbox.component.html',
  styleUrls: ['./userbox.component.scss'],
})
export class UserboxComponent implements OnInit {
  @Input() member: MemberInfo = {};

  constructor() {}

  ngOnInit(): void {}
}
