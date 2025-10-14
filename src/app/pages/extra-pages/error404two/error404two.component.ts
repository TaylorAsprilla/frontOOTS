import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DefaultLayout2Component } from 'src/app/shared/ui/default-layout2/default-layout2.component';

@Component({
  selector: 'app-error404two',
  standalone: true,
  imports: [CommonModule, RouterModule, DefaultLayout2Component],
  templateUrl: './error404two.component.html',
  styleUrls: ['./error404two.component.scss'],
})
export class Error404twoComponent implements OnInit {
  currentYear!: number;

  constructor() {}

  ngOnInit(): void {
    this.currentYear = Date.now();
  }
}
