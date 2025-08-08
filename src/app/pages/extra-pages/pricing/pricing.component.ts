import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { PricingPlan } from 'src/app/shared/widget/pricing-cards/pricing-card.model';
import { PLANS } from './data';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  pricingPlans: PricingPlan[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Extra Pages', path: '/' }, { label: 'Pricing', path: '/', active: true }];
    this._fetchData();
  }

  /**
   * Fetches the plans data
   */
  _fetchData() {
    this.pricingPlans = PLANS;
  }

}
