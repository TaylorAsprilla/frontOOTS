import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Variant } from '../shared/ui.model';

// ribbon card
interface RibbonItem extends Variant {
  direction: string;
}

@Component({
  selector: 'app-ui-ribbons',
  templateUrl: './ribbons.component.html',
  styleUrls: ['./ribbons.component.scss']
})
export class RibbonsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  ribbonVariants: RibbonItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Ribbons', path: '/', active: true }];
    this.ribbonVariants = [
      {
        name: 'Blue',
        color: 'blue',
        direction: 'left'
      },
      {
        name: 'Primary',
        color: 'primary',
        direction: 'right'
      },
      {
        name: 'Success',
        color: 'success',
        direction: 'right'
      },
      {
        name: 'Info',
        color: 'info',
        direction: 'left'
      },
      {
        name: 'Warning',
        color: 'warning',
        direction: 'right'
      },
      {
        name: 'Danger',
        color: 'danger',
        direction: 'right'
      },
      {
        name: 'Pink',
        color: 'pink',
        direction: 'left'
      },
      {
        name: 'Secondary',
        color: 'secondary',
        direction: 'right'
      },
      {
        name: 'Dark',
        color: 'dark',
        direction: 'right'
      },

    ];
  }


}
