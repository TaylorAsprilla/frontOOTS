import { Component, Input, OnInit } from '@angular/core';
import '../country-map-registry';
import 'jsvectormap-country-maps/dist/maps/canada.js';

@Component({
  selector: 'app-widget-canada-map',
  templateUrl: './canada-map.component.html',
  styleUrls: ['./canada-map.component.scss']
})
export class CanadaMapComponent implements OnInit {

  @Input() width: string = '';
  @Input() height: string = '';
  @Input() options: any = {};
  @Input() mapId: string = "canadamap";

  constructor () { }

  ngOnInit(): void {
  }

}
