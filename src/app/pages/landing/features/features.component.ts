import { Component, OnInit } from '@angular/core';
import { Feature, FEATURES } from './data';

@Component({
  selector: 'app-landing-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {

  featureList: Feature[] = [];

  constructor () { }

  ngOnInit(): void {
    this.featureList = FEATURES;
  }

}
