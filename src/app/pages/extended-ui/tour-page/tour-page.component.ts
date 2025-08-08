import { Component, OnInit } from '@angular/core';
import { JoyrideService } from 'ngx-joyride';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-extended-ui-tour-page',
  templateUrl: './tour-page.component.html',
  styleUrls: ['./tour-page.component.scss']
})
export class TourPageComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];

  constructor (private readonly joyrideService: JoyrideService) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Extended UI', path: '/' }, { label: 'Tour', path: '/', active: true }];
    this.joyrideService.startTour(
      { steps: ['firstStep', 'secondStep', 'thirdStep'], showCounter: false, themeColor: '#000000' } // steps order
    );
  }
}
