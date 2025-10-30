import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingPlan } from './pricing-card.model';

@Component({
  selector: 'app-widget-pricing-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing-cards.component.html',
  styleUrls: ['./pricing-cards.component.scss'],
})
export class PricingCardsComponent implements OnInit {
  @Input() pricingPlans: PricingPlan[] = [];
  @Input() containerClass: string = '';
  @Input() pricingCardClass?: string = '';

  constructor() {}

  ngOnInit(): void {}
}
