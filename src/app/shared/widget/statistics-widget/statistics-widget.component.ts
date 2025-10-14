import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUpModule } from 'ngx-countup';
import { CountUpOptions } from 'countup.js';

@Component({
  selector: 'app-widget-statistics',
  standalone: true,
  imports: [CommonModule, CountUpModule],
  templateUrl: './statistics-widget.component.html',
  styleUrls: ['./statistics-widget.component.scss'],
})
export class StatisticsWidgetComponent implements OnInit {
  @Input() icon?: string;
  @Input() iconCssClasses?: string;
  @Input() stats: number = 0;
  @Input() options?: CountUpOptions;
  @Input() label: string = '';
  @Input() labelCssClasses: string = '';

  constructor() {}

  ngOnInit(): void {}
}
