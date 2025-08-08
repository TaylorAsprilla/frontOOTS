import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-simple-loading-button',
  templateUrl: './simple-button.component.html',
  styleUrls: ['./simple-button.component.scss']
})
export class SimpleButtonComponent implements OnInit {

  @Input() btnClasses: string = '';
  @Input() dataStyle?: string;

  // trigger-variable for Ladda
  isLoading: boolean = false;

  constructor () { }

  ngOnInit(): void {
  }

  /**
   * starts button loading
   */
  startLoading() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

}
