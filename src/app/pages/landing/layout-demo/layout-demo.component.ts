import { Component, OnInit } from '@angular/core';

//layout interface
interface Layout {
  name: string;
  imageUrl: string;
  link: string;
}


@Component({
  selector: 'app-landing-layout-demo',
  templateUrl: './layout-demo.component.html',
  styleUrls: ['./layout-demo.component.scss']
})
export class LayoutDemoComponent implements OnInit {

  layoutList: Layout[] = [];

  constructor () { }

  ngOnInit(): void {
    this.layoutList = [
      {
        name: 'Default (Vertical)',
        imageUrl: 'assets/images/landing/demo/layout-1.png',
        link: 'http://ubold-ng-d.coderthemes.com',
      },
      {
        name: 'Creative     (Horizontal)',
        imageUrl: 'assets/images/landing/demo/layout-2.png',
        link: 'http://ubold-ng-creative.coderthemes.com',
      },
      {

        name: 'Material',
        imageUrl: 'assets/images/landing/demo/layout-3.png',
        link: 'http://ubold-ng-material.coderthemes.com',
      },
      {

        name: 'Modern (Detached)',
        imageUrl: 'assets/images/landing/demo/layout-4.png',
        link: 'http://ubold-ng-modern.coderthemes.com',
      },
      {

        name: 'Purple',
        imageUrl: 'assets/images/landing/demo/layout-5.png',
        link: 'http://ubold-ng-purple.coderthemes.com',
      },
      {

        name: 'Saas (Two-Column)',
        imageUrl: 'assets/images/landing/demo/layout-6.png',
        link: 'http://ubold-ng-saas.coderthemes.com',
      },
      {

        name: 'Dark (Default)',
        imageUrl: 'assets/images/landing/demo/layout-7.png',
        link: 'http://ubold-ng-d-dark.coderthemes.com',
      },
    ];

  }

}
