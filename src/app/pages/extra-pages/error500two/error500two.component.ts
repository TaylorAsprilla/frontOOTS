import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DefaultLayout2Component } from 'src/app/shared/ui/default-layout2/default-layout2.component';

@Component({
  selector: 'app-error500two',
  standalone: true,
  imports: [CommonModule, RouterModule, DefaultLayout2Component],
  templateUrl: './error500two.component.html',
  styleUrls: ['./error500two.component.scss'],
})
export class Error500twoComponent implements OnInit {
  currentYear!: number;

  constructor() {}

  ngOnInit(): void {
    this.currentYear = Date.now();
  }
}
