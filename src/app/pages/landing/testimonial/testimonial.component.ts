import { Component, OnInit } from '@angular/core';
import { Testimonial, TESTIMONIALS } from './data';

@Component({
  selector: 'app-landing-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss']
})
export class TestimonialComponent implements OnInit {

  testimonials: Testimonial[] = [];

  constructor () { }

  ngOnInit(): void {
    this.testimonials = TESTIMONIALS;
  }

}
