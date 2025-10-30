import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from 'src/app/shared/ui/default-layout/default-layout.component';

@Component({
  selector: 'app-error404',
  standalone: true,
  imports: [CommonModule, RouterModule, DefaultLayoutComponent],
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.scss'],
})
export class Error404Component implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
