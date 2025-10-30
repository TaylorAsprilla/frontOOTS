import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [RouterModule, CommonModule],
  standalone: true,
})
export class FooterComponent implements OnInit {
  currentYear!: number;

  constructor() {}

  ngOnInit(): void {
    this.currentYear = Date.now();
  }
}
