import { Component, OnInit } from '@angular/core';
import { Services, SERVICES } from './data';

@Component({
  selector: 'app-landing-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  services: Services[] = [];

  constructor () { }

  ngOnInit(): void {
    this.services = SERVICES;
  }

}
