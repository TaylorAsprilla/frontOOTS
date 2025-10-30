import { Component, OnInit } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { getLayoutConfig } from '../shared/helper/utils';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss']
})
export class PublicLayoutComponent implements OnInit {

  constructor () { }

  ngOnInit(): void {
    let config = getLayoutConfig();
    document.body.setAttribute('data-layout-color', config.layoutColor)
  }

}
