import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DefaultLayout2Component } from 'src/app/shared/ui/default-layout2/default-layout2.component';

@Component({
  selector: 'app-error404-alt',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './error404-alt.component.html',
  styleUrls: ['./error404-alt.component.scss'],
})
export class Error404AltComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
