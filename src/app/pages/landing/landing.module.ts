import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeroComponent } from './hero/hero.component';
import { ServicesComponent } from './services/services.component';
import { FeaturesComponent } from './features/features.component';
import { PricingComponent } from './pricing/pricing.component';
import { FaqComponent } from './faq/faq.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutDemoComponent } from './layout-demo/layout-demo.component';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LandingComponent,
    NavbarComponent,
    HeroComponent,
    ServicesComponent,
    FeaturesComponent,
    PricingComponent,
    FaqComponent,
    TestimonialComponent,
    ContactUsComponent,
    FooterComponent,
    LayoutDemoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    WidgetModule,
    LandingRoutingModule
  ]
})
export class LandingModule { }
