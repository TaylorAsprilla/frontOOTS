import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { widgetFaqItem } from 'src/app/shared/widget/faq/faq.model';
import { rawFAQs } from './data';
import { widgetFaqComponent } from 'src/app/shared/widget/faq/widgetFaq.component';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  imports: [widgetFaqComponent, PageTitleComponent],
})
export class FaqComponent implements OnInit {
  rawFAQ: widgetFaqItem[] = [];
  pageTitle: BreadcrumbItem[] = [];

  constructor() {}

  ngOnInit(): void {
    this.pageTitle = [
      { label: 'Extra Pages', path: '/' },
      { label: 'FAQ', path: '/', active: true },
    ];
    this.rawFAQ = rawFAQs;
  }
}
