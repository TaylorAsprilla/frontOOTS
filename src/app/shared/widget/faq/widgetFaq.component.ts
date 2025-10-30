import { Component, Input, OnInit } from '@angular/core';
import { widgetFaqItem } from './faq.model';

@Component({
  selector: 'app-widget-faq',
  templateUrl: './widget-faq.component.html',
  styleUrls: ['./widget-faq.component.scss'],
})
export class widgetFaqComponent implements OnInit {
  @Input() rawFAQ: widgetFaqItem[] = [];
  @Input() containerClass?: string = '';
  constructor() {}

  ngOnInit(): void {}
}
