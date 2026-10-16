import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [CommonModule, DatePipe],
  standalone: true,
})
export class FooterComponent implements OnInit {
  currentYear!: number;
  constructor() {}

  ngOnInit(): void {
    this.currentYear = Date.now();
  }
}
