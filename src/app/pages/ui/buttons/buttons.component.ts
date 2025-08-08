import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Variant } from '../shared/ui.model';

// button labels
type ButtonLabel = {
  icon: string;
  name: string;
  variant: string;
}

// checkbox button group
type BtnGroupCheckbox = {
  left: boolean;
  right: boolean;
  middle: boolean;
}

@Component({
  selector: 'app-ui-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  buttonVariants1: Variant[] = [];
  buttonVariants2: Variant[] = [];
  buttonLabels: ButtonLabel[] = [];
  multipleChoice!: BtnGroupCheckbox;
  singleChoice: any = 1;


  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Buttons', path: '/', active: true }];
    this.buttonVariants1 = [{
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
      name: 'Dark',
      color: 'dark',
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
      name: 'Secondary',
      color: 'secondary',
    },
    {
      name: 'Light',
      color: 'light',
    },
    {
      name: 'White',
      color: 'white'
    }
    ];
    this.buttonVariants2 = [{
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
      name: 'Dark',
      color: 'dark',
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
      name: 'Secondary',
      color: 'secondary',
    }];
    this.buttonLabels = [{
      icon: 'mdi mdi-check-all',
      name: 'Success',
      variant: 'success'
    },
    {
      icon: 'mdi mdi-close-circle-outline',
      name: 'Danger',
      variant: 'danger'
    },
    {
      icon: 'mdi mdi-alert-circle-outline',
      name: 'Info',
      variant: 'info'
    },
    {
      icon: 'mdi mdi-alert',
      name: 'Warning',
      variant: 'warning'
    }];

    this.multipleChoice = {
      left: true,
      right: false,
      middle: false
    }
  }

}
