import { Component, Input, OnInit } from '@angular/core';
import { CountUpOptions } from 'countup.js';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CountUpModule } from 'ngx-countup';

@Component({
  selector: 'app-widget-statistics-card4',
  templateUrl: './statistics-card4.component.html',
  styleUrls: ['./statistics-card4.component.scss'],
  imports: [CommonModule, DecimalPipe, CountUpModule],
  standalone: true,
})
export class StatisticsCard4Component implements OnInit {
  @Input() variant?: string;
  @Input() description?: string;
  @Input() stats?: number;
  @Input() icon?: string;
  @Input() iconContainerClass?: string;
  @Input() options?: CountUpOptions;

  constructor() {}

  ngOnInit(): void {}
}
