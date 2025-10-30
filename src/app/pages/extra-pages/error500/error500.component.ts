import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from 'src/app/shared/ui/default-layout/default-layout.component';

@Component({
  selector: 'app-error-500',
  templateUrl: './error500.component.html',
  styleUrls: ['./error500.component.scss'],
  imports: [CommonModule, RouterModule, DefaultLayoutComponent],
  standalone: true,
})
export class Error500Component implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
