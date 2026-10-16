import { Component, Input, OnInit } from '@angular/core';
import '../country-map-registry';
import 'jsvectormap-country-maps/dist/maps/russia.js';

@Component({
  selector: 'app-widget-russia-map',
  templateUrl: './russia-map.component.html',
  styleUrls: ['./russia-map.component.scss']
})
export class RussiaMapComponent implements OnInit {

  @Input() width: string = '';
  @Input() height: string = '';
  @Input() options: any = {};
  @Input() mapId: string = "russiamap";

  constructor () { }

  ngOnInit(): void {
  }

}
