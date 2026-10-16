import { Component, Input, OnInit } from '@angular/core';
import '../country-map-registry';
import 'jsvectormap-country-maps/dist/maps/us-merc-en.js';

@Component({
  selector: 'app-widget-usa-map',
  templateUrl: './usa-map.component.html',
  styleUrls: ['./usa-map.component.scss']
})
export class UsaMapComponent implements OnInit {

  @Input() width: string = '';
  @Input() height: string = '';
  @Input() options: any = {};
  @Input() mapId: string = "usamap";

  constructor () { }

  ngOnInit(): void {
  }

}
