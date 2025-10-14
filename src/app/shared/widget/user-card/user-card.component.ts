import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/core/models/auth.models';
import { UserCard } from './user-card.model';

@Component({
  selector: 'app-widget-user-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent implements OnInit {
  @Input() user!: UserCard;

  constructor() {}

  ngOnInit(): void {}
}
