import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUpModule } from 'ngx-countup';
import { TranslocoModule } from '@ngneat/transloco';
import { StatisticsCard1 } from './statistics-card.model';

@Component({
  selector: 'app-widget-statistics-card1',
  standalone: true,
  imports: [CommonModule, CountUpModule, TranslocoModule],
  templateUrl: './statistics-card.component.html',
  styleUrls: ['./statistics-card.component.scss'],
})
export class StatisticsCardComponent implements OnInit {
  @Input() statisticsCardData!: StatisticsCard1;

  constructor() {}

  ngOnInit(): void {}
}
