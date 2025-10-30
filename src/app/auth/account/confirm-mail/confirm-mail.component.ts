import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from 'src/app/shared/ui/default-layout/default-layout.component';

@Component({
  selector: 'app-auth-confirm-mail',
  templateUrl: './confirm-mail.component.html',
  styleUrls: ['./confirm-mail.component.scss'],
  imports: [CommonModule, RouterModule, DefaultLayoutComponent],
  standalone: true,
})
export class ConfirmMailComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
