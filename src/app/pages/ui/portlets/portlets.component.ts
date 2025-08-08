import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

// portlet card
type PortletCard = {
  cardClasses: string;
  cardTitleClasses?: string;
}

@Component({
  selector: 'app-ui-portlets',
  templateUrl: './portlets.component.html',
  styleUrls: ['./portlets.component.scss']
})
export class PortletsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  basicPortlets: PortletCard[] = [];
  portletsWithHeader: PortletCard[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Portlets', path: '/', active: true }];
    this.basicPortlets = [{ cardClasses: '' }, { cardClasses: 'bg-primary text-white', cardTitleClasses: 'text-white' }, { cardClasses: 'bg-success text-white', cardTitleClasses: 'text-white' }];
    this.portletsWithHeader = [{
      cardClasses: 'bg-danger text-white',
      cardTitleClasses: 'text-white'
    },
    {
      cardClasses: 'bg-blue text-white',
      cardTitleClasses: 'text-white'
    },
    {
      cardClasses: 'bg-warning text-',
      cardTitleClasses: 'text-white'
    },
    {
      cardClasses: 'bg-info text-white',
      cardTitleClasses: 'text-white'
    },
    {
      cardClasses: 'bg-dark text-light',
      cardTitleClasses: 'text-light'
    },
    {
      cardClasses: 'bg-pink text-white',
      cardTitleClasses: 'text-white'
    }]
  }




}
