import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-widget-chart-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-statistics.component.html',
  styleUrls: ['./chart-statistics.component.scss'],
})
export class ChartStatisticsComponent implements OnInit {
  @Input() title?: string;
  @Input() icon?: string;
  @Input() stats?: string;
  @Input() variant?: string;

  constructor() {}

  ngOnInit(): void {}
}
