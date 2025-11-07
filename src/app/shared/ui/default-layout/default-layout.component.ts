import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit {
  @Input() containerClass: string = '';

  currentYear!: number;

  constructor() {}

  ngOnInit(): void {
    this.currentYear = Date.now();
  }

  ngAfterViewInit(): void {
    document.body.classList.add('authentication-bg', 'authentication-bg-pattern');
  }
}
