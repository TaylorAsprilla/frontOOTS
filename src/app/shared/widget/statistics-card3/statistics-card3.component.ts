import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUpModule } from 'ngx-countup';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CountUpOptions } from 'countup.js';

@Component({
  selector: 'app-widget-statistics-card3',
  standalone: true,
  imports: [CommonModule, CountUpModule, NgbTooltipModule],
  templateUrl: './statistics-card3.component.html',
  styleUrls: ['./statistics-card3.component.scss'],
})
export class StatisticsCard3Component implements OnInit {
  @Input() title: string = '';
  @Input() stats: number = 0;
  @Input() trendIcon: string = '';
  @Input() trendLabel: string = '';
  @Input() trendValue: string = '';
  @Input() trendStats: string = '';
  @Input() variant: string = '';
  @Input() options?: CountUpOptions;

  constructor() {}

  ngOnInit(): void {}
}
