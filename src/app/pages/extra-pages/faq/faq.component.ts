import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { FAQItem } from 'src/app/shared/widget/faq/faq.model';
import { rawFAQs } from './data';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  rawFAQ: FAQItem[] = [];
  pageTitle: BreadcrumbItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Extra Pages', path: '/' }, { label: 'FAQ', path: '/', active: true }];
    this.rawFAQ = rawFAQs;
  }

}
