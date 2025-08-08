import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Variant } from '../shared/ui.model';
import { CardGroupItem } from './cards.model';

@Component({
  selector: 'app-ui-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  coloredCards: Variant[] = [];
  coloredTextCards: Variant[] = [];
  cardStyles: Variant[] = [];
  cardGroup: CardGroupItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Cards', path: '/', active: true }];

    this.coloredCards = [
      {
        name: 'Primary',
        color: 'primary',
      },
      {
        name: 'Success',
        color: 'success',
      },
      {
        name: 'Info',
        color: 'info',
      },
      {
        name: 'Warning',
        color: 'warning',
      },
      {
        name: 'Danger',
        color: 'danger',
      },
      {
        name: 'Blue',
        color: 'blue',
      },
      {
        name: 'Pink',
        color: 'pink',
      },
      {
        name: 'Dark',
        color: 'dark',
      }
    ];
    this.coloredTextCards = [
      {
        name: 'Primary',
        color: 'primary',
      },
      {
        name: 'Secondary',
        color: 'secondary',
      },
      {
        name: 'Success',
        color: 'success',
      }];

    this.cardStyles = [
      {
        name: 'Primary',
        color: 'primary',
      },

      {
        name: 'Success',
        color: 'success',
      },
      {
        name: 'Danger',
        color: 'danger',
      }

    ];

    this.cardGroup = [
      {
        id: 1,
        image: 'assets/images/small/img-1.jpg',
        title: 'Card title',
        text: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
        subtext: 'Last updated 3 mins ago'
      },
      {
        id: 2,
        image: 'assets/images/small/img-2.jpg',
        title: 'Card title',
        text: 'This card has supporting text below as a natural lead-in to additional content.',
        subtext: 'Last updated 3 mins ago'
      },
      {
        id: 3,
        image: 'assets/images/small/img-3.jpg',
        title: 'Card title',
        text: 'This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.',
        subtext: 'Last updated 3 mins ago'
      }
    ];
  }

}
