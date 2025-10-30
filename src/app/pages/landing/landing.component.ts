import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { FeaturesComponent } from './features/features.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeroComponent } from './hero/hero.component';
import { ServicesComponent } from './services/services.component';
import { LayoutDemoComponent } from './layout-demo/layout-demo.component';
import { PricingComponent } from './pricing/pricing.component';
import { FaqComponent } from './faq/faq.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  imports: [
    FeaturesComponent,
    NavbarComponent,
    HeroComponent,
    ServicesComponent,
    LayoutDemoComponent,
    PricingComponent,
    FaqComponent,
    TestimonialComponent,
    ContactUsComponent,
    FooterComponent,
  ],
})
export class LandingComponent implements OnInit {
  backToTopButton: any;
  loggedInUser: any = {};

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.currentUser();

    let mybutton = document.getElementById('back-to-top-btn');
    window.addEventListener('scroll', () => {
      if (mybutton) {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
          mybutton.style.display = 'block';
        } else {
          mybutton.style.display = 'none';
        }
      }
    });
  }

  ngAfterViewInit(): void {
    document.body.classList.add('pb-0');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('pb-0');
  }

  /**
   * reach to top of web page
   */
  topFunction(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}
