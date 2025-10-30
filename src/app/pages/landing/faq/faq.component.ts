import { Component, OnInit } from '@angular/core';
import { widgetFaqItem } from 'src/app/shared/widget/faq/faq.model';
import { widgetFaqComponent } from 'src/app/shared/widget/faq/widgetFaq.component';

@Component({
  selector: 'app-landing-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  imports: [widgetFaqComponent],
  standalone: true,
})
export class FaqComponent implements OnInit {
  FAQs: widgetFaqItem[] = [];
  constructor() {}

  ngOnInit(): void {
    this.FAQs = [
      {
        id: 1,
        question: 'What is Lorem Ipsum?',
        answer:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        textClass: 'pb-1 text-muted',
      },
      {
        id: 2,
        question: 'Is safe use Lorem Ipsum?',
        answer:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        textClass: 'pb-1 text-muted',
      },
      {
        id: 3,
        question: 'Why use Lorem Ipsum?',
        answer:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        textClass: 'pb-1 text-muted',
      },
      {
        id: 4,
        question: 'When can be used?',
        answer:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        textClass: 'pb-1 text-muted',
      },
      {
        id: 5,
        question: 'How many variations exist?',
        answer:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        textClass: 'pb-1 text-muted',
      },
      {
        id: 6,
        question: 'License & Copyright',
        answer:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        textClass: 'pb-1 text-muted',
      },
    ];
  }
}
