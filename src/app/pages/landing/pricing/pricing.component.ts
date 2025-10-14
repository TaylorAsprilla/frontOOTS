import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';
import { PricingCardsComponent } from 'src/app/shared/widget/pricing-cards/pricing-cards.component';
import { PricingPlan } from 'src/app/shared/widget/pricing-cards/pricing-card.model';
import { PLANS } from './data';

@Component({
  selector: 'app-landing-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
  standalone: true,
  imports: [CommonModule, PricingCardsComponent],
})
export class PricingComponent implements OnInit {
  pricingPlans: PricingPlan[] = [];

  constructor() {}

  ngOnInit(): void {
    this.pricingPlans = PLANS;
  }
}
